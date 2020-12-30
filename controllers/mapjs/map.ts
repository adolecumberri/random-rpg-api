import { rand, getProb } from "../../commonModules/utils";
import { connection } from "../../config/database";
import { ICity, IMapTurn, ITeam } from "../../interfaces/Map.interface";
import { GroupFightByIds } from "../groupFight.controller";
import { CIUDADES } from "./map.dictionary";

export class EventMap {
  constructor(eventType: number) {
    //   TODO: Cargar de la base de datos el mapa y el evento.
    this.eventType = eventType;
    //Carga de ciudades
    this.cities = CIUDADES.map((city) => {
      return {
        ...city,
        teams: {
          M: [],
          F: [],
          Other: [],
        },
      };
    }) as ICity[];
  }

  cities: ICity[] = [];
  teams: ITeam[] = [];
  teamsOut: ITeam[] = []; //DATO: unused puede que para algo futuro.

  eventType: number;
  eventId: number = -1;

  MAX_FIGHTS_PER_PLACE = 4;
  MIGRATION_PROB = 0.33;

  eventTurn = 0;

  //init event tendría que cargar randomly los grupos en lugares random.
  //DATO: no filtro por "ingame", es decir, traigo a los equipos que están fuera del equipo.
  init: () => Promise<void> = async () => {
    await this.loadTurn();

    //cargo evento_Id generando el evento
    await new Promise((resolve, reject) => {
      connection.query(
        `insert into events set name = "HvsM", id_map = 1;`,
        async (err, result) => {
          console.log(
            `Created event type ${this.eventType}. Id: ${result.insertId}`
          );
          this.eventId = result.insertId as number;
          resolve(true);
        }
      );
    });

    ////

    console.log("teams loaded: ", this.teams.length);

    this.teams.forEach((team) => {
      if (team.side === "MALE") {
        this.cities[rand(0, this.cities.length - 1)].teams.M.push(team);
      } else if (team.side === "FEMALE") {
        this.cities[rand(0, this.cities.length - 1)].teams.F.push(team);
      } else {
        this.cities[rand(0, this.cities.length - 1)].teams.Other.push(team);
      }
    });
  };

  //ejecutar turno:
  // ejecutar peleas y mover resultantes
  execTurn = () => {
    //pasa un turno
    this.eventTurn++;
    let turnParams: IMapTurn[] = [];

    this.listCities();
    //Cargar
    this.cities.forEach((c) => {
      let params: IMapTurn = {
        id: c.id,
        fighting: [],
        moving: [],
        staying: [],
      };

      //4 vueltas || no hay equipos M || no hay equipos F
      // cargo params del attributo params.fighting
      for (
        let i = 0;
        i < this.MAX_FIGHTS_PER_PLACE &&
        c.teams.M.length > 0 &&
        c.teams.F.length > 0;
        i++
      ) {
        //cargo los parametros de fighting.
        /*
                    1 && DEFAULT - Male-female
                    2- Male-Other
                    3- Female-Other
                */
        switch (Math.round(Math.random() * 2 + 1)) {
          case 2:
            //console.log('case 2');
            if (c.teams.Other.length) {
              params.fighting.push({
                A: c.teams.M[Math.floor(Math.random() * c.teams.M.length)],
                B:
                  c.teams.Other[
                    Math.floor(Math.random() * c.teams.Other.length)
                  ],
              });
              break;
            }
          case 3:
            //console.log('case 3');
            //si hay Others, pelean Others, sino male-female
            if (c.teams.Other.length) {
              params.fighting.push({
                A:
                  c.teams.Other[
                    Math.floor(Math.random() * c.teams.Other.length)
                  ],
                B: c.teams.F[Math.floor(Math.random() * c.teams.F.length)],
              });
              break;
            }
          default:
            //console.log('case 1');
            params.fighting.push({
              A: c.teams.M[Math.floor(Math.random() * c.teams.M.length)],
              B: c.teams.F[Math.floor(Math.random() * c.teams.F.length)],
            });
            break;
        }
      }

      //compruebo si cada equipo restante se va.
      //params.moving
      c.teams.M.forEach((team, index) => {
        if (this.MIGRATION_PROB < getProb()) {
          params.moving.push({
            from: c.id,
            to: c.connections[rand(0, c.connections.length - 1)],
            team: c.teams.M.splice(
              Math.floor(Math.random() * c.teams.M.length),
              1
            )[0],
            type: "M",
          });
        }
      });

      //compruebo si cada equipo restante se va.
      c.teams.F.forEach((team, index) => {
        if (this.MIGRATION_PROB < getProb()) {
          params.moving.push({
            from: c.id,
            to: c.connections[rand(0, c.connections.length - 1)],
            team: c.teams.F.splice(
              Math.floor(Math.random() * c.teams.F.length),
              1
            )[0],
            type: "F",
          });
        }
      });

      //compruebo si cada equipo restante se va.
      c.teams.Other.forEach((team, index) => {
        if (this.MIGRATION_PROB < getProb()) {
          params.moving.push({
            from: c.id,
            to: c.connections[rand(0, c.connections.length - 1)],
            team: c.teams.Other.splice(
              Math.floor(Math.random() * c.teams.Other.length),
              1
            )[0],
            type: "Other",
          });
        }
      });

      //Params.staying
      //Si no se han ido, estan en estado "staying"
      c.teams.M.forEach(() => {
        params.staying.push({
          team: c.teams.M.splice(0, 1)[0],
          where: c.id,
          type: "M",
        });
      });

      //Equipos femeninos quedandose

      c.teams.F.forEach(() => {
        params.staying.push({
          team: c.teams.F.splice(0, 1)[0],
          where: c.id,
          type: "F",
        });
      });

      //Other teams staying

      c.teams.Other.forEach(() => {
        params.staying.push({
          team: c.teams.Other.splice(0, 1)[0],
          where: c.id,
          type: "Other",
        });
      });

      //Inserto en el array los parametros calculados.
      turnParams.push(params);
    });

    console.log("a");

    //Procesar
    turnParams.forEach(async (turnParam, index, array) => {
      turnParam.fighting.forEach(async (f) => {
        /*Fight result
            -1: error ?
            1: groupA wins
            2: groupB wins
            3: draw -stopped before end
            4: both death.
        */
        let figthResult = await GroupFightByIds(f.A.id, f.B.id);

        let query: string = "";

        switch (figthResult.groupFightResult) {
          case 1:
            query = `update crew set ingame = 0 where id = ${f.A.id}`;
            break;
          case 2:
            query = `update crew set ingame = 0 where id = ${f.B.id}`;
            break;
          case 3:
            //nothing.
            break;
          case 4:
            query = `UPDATE crew SET ingame = 0 WHERE id = ${f.A.id} OR id = ${f.B.id}`;
            break;
          default:
            console.log(`fight ha dado -1 ?`);
            break;
        }

        console.log("turno out", query);
        /* inserting event_journal fights */
        await Promise.resolve(
          new Promise((res, rej) => {
            //si query tiene algo, entro.
            if (!!query)
              connection.query(query, async (err1, res1) => {
                if (err1) throw err1;

                //id, id_event, event_turn, action, id_groupfight
                connection.query(
                  `INSERT INTO event_journal VALUES (null, ${this.eventType}, ${this.eventTurn}, "FIGHTING", ${figthResult.id_groupFight} );`,
                  (err2, res2) => {
                    if (err2) throw err2;
                    console.log("inserted_event journal. id:" + res2.insertId);
                    res(res2.insertId);
                  }
                );
              });
          })
        );
      });

      /*moving interface
      {
        team: ITeam;
        from: number;
        to: number;
        type: "M" | "F" | "Other";
      }[]
      */
      /*table group_moving {
       id: auto_increment, ----> id de la row.
       id_crew: int ----> qué equipo.
       origin: int -----> id de la ciudad
       destiny: int/null ---> es null si esta staying.
     }*/
      //DATO: las ids "from" y "to" hacen referencias a map_locations.id
      turnParam.moving.forEach(async (moving_crew) => {
        let query = `INSERT INTO groupmoving VALUES (null, ${moving_crew.team.id}, ${moving_crew.from}, ${moving_crew.to});`;
        await Promise.resolve(
          new Promise((res, rej) => {
            connection.query(query, (err, result) => {
              if (err) throw err;
              //"FIGHTING", "MOVING", "STAYING"
              connection.query(
                `INSERT INTO event_journal VALUES (null, ${this.eventType}, ${this.eventTurn}, "MOVING", ${result.insertId} );`,
                (err2, res2) => {
                  if (err2) throw err2;
                  console.log("inserted_event journal. id:" + res2.insertId);
                  res(res2.insertId);
                }
              );

              res(console.log("inserted group Moving. id: " + result.insertId));
            });
          })
        );
      });

      turnParam.staying.forEach(async (staying_crew) => {
        let query = `INSERT INTO groupmoving VALUES (null, ${staying_crew.team.id}, ${staying_crew.where}, null);`;
        await Promise.resolve(
          new Promise((res, rej) => {
            connection.query(query, (err, result) => {
              if (err) throw err;
              //"FIGHTING", "MOVING", "STAYING"
              connection.query(
                `INSERT INTO event_journal VALUES (null, ${this.eventType}, ${this.eventTurn}, "STAYING", ${result.insertId} );`,
                (err2, res2) => {
                  if (err2) throw err2;
                  console.log("inserted_event journal. id:" + res2.insertId);
                  res(res2.insertId);
                }
              );
              res(
                console.log("inserted group staying. id: " + result.insertId)
              );
            });
          })
        );
      });
    });

    let a = 0;

    console.log("para aqui. que coño pasa");

    //Descargar
    //TODO: cargar comprobantes. Ha acabado el combate?
    console.log("finished turn");
    this.listCities();
  };

  listCities = () => {
    console.table(
      this.cities.map((c) => [
        c.id,
        c.name,
        c.connections,
        c.teams.M.map((c) => c.id),
        c.teams.F.map((c) => c.id),
        c.teams.Other.map((c) => c.id),
      ])
    );
  };

  getInfoFromCities = (citieIndex: number) => {
    this.cities.forEach((c) => {
      if (citieIndex === c.id) {
        console.log(`---------- ${c.id} - ${c.name} ----------`);
        console.log(`MALE TEAMS:`);
        c.teams.M.forEach((mTeam) => {
          console.log(
            `${mTeam.id} - ${mTeam.name}: alive: ${mTeam.heros_alive}. death: ${
              mTeam.heros_death
            }. in game?: ${!!mTeam.ingame}`
          );
        });
        console.log(`FEMALE TEAMS:`);
        c.teams.F.forEach((fTeam) => {
          console.log(
            `${fTeam.id} - ${fTeam.name}: alive: ${fTeam.heros_alive}. death: ${
              fTeam.heros_death
            }. in game?: ${!!fTeam.ingame}`
          );
        });
      }
    });
  };

  loadTurn = async () => {
    let q = `select crew.id,
    nombre as name,
    crew.side,
    ingame,
    a.alive_heros,
    a.death_heros,
    a.alive_heros + a.death_heros as 'total_heros'
  from crew
    inner join heros_crew on crew.id = heros_crew.id_crew
    inner join (
      select a.id as id,
        alive_heros,
        death_heros
      from (
          select id_crew as id,
            COALESCE(sum(if(hero_isalive = 1, 1, 0)), 0) as 'alive_heros'
          from heros_crew
          group by id_crew
        ) as a
        inner join (
          select id_crew as id,
            COALESCE(sum(if(hero_isalive = 0, 1, 0)), 0) as 'death_heros'
          from heros_crew
          group by id_crew
        ) as b on a.id = b.id
    ) as a on heros_crew.id_crew = a.id
  group by crew.id;`;

    //cargo equios filtrando por "ingame"

    return Promise.resolve(
      await new Promise((resolve, reject) => {
        connection.query(q, (err, result: ITeam[]) => {
          result.forEach((team) => {
            if (team.ingame) {
              this.teams.push(team);
            } else {
              this.teamsOut.push(team);
            }
          });
          resolve(this.teams.length);
        });
      })
    ).then((v) => v);
  };

  getProb: () => number = () => Math.random();
}
