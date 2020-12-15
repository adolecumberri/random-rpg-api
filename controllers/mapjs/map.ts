import { rand, getProb } from '../../commonModules/utils';
import { connection } from '../../config/database';
import { ICity, IMapTurn, ITeam } from '../../interfaces/Map.interface';
import { GroupFightByIds } from '../groupFight.controller';
import { CIUDADES } from './map.dictionary';

export class EventMap {
	constructor(eventType: number) {
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

	eventType: number;
	eventId: number = -1;

	MAX_FIGHTS_PER_PLACE = 4;
	MIGRATION_PROB = 0.33;

	eventDay = 0;

	//init event tendría que cargar randomly los grupos en lugares random.
	init: () => Promise<void> = async () => {
		let q = `select crew.id, nombre as name, crew.side , ingame, a.heros_alive, a.heros_death
        from crew 
        inner join heros_crew 
        on crew.id = heros_crew.id_crew
        inner join (
            select a.id as id, heros_alive, heros_death 
        from  (select id_crew as id, count(hero_isalive) as 'heros_alive' 
                from heros_crew  
                where hero_isalive = ${this.eventType} 
                group by id_crew) as a
        inner join (
                select id_crew as id, IF(count(*) is null, count(*), 0) as 'heros_death'
                from heros_crew  
                group by id_crew) as b
        on  a.id = b.id
        )  as a
        on heros_crew.id_crew = a.id 
        group by crew.id;`;

		//cargo equios
		await new Promise((resolve, reject) => {
			connection.query(q, (err, result: ITeam[]) => {
				this.teams = result;
				resolve(true);
			});
		});

		//cargo evento_Id generando el evento
		await new Promise((resolve, reject) => {
			connection.query(`insert into events set name = "HvsM", id_map = 1;`, async (err, result) => {
                console.log(result);
				this.eventId = result.insertId as number;
				resolve(true);
			});
		});

		////

		console.log('teams loaded');
		console.log(this.teams.length);

		this.teams.forEach((team) => {
			if (team.side === 'MALE') {
				this.cities[rand(0, this.cities.length - 1)].teams.M.push(team);
			} else if (team.side === 'FEMALE') {
				this.cities[rand(0, this.cities.length - 1)].teams.F.push(team);
			} else {
				this.cities[rand(0, this.cities.length - 1)].teams.Other.push(team);
			}
		});
	};

	//ejecutar turno:
	// ejecutar peleas y mover resultantes
	execTurn = () => {
		this.listCities();
		let turnParams: IMapTurn[] = [];

		//Cargar
		this.cities.forEach((c) => {
			let params: IMapTurn = {
				id: c.id,
				fighting: [],
				moving: [],
			};

			//4 vueltas || no hay equipos M || no hay equipos F
			for (let i = 0; i < this.MAX_FIGHTS_PER_PLACE && c.teams.M.length > 0 && c.teams.F.length > 0; i++) {
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
								// A: c.teams.M.splice(Math.floor(Math.random() * c.teams.M.length), 1)[0],
								// B: c.teams.Other.splice(Math.floor(Math.random() * c.teams.Other.length), 1)[0],
								A: c.teams.M[Math.floor(Math.random() * c.teams.M.length)],
								B: c.teams.Other[Math.floor(Math.random() * c.teams.Other.length)],
							});
							break;
						}
					case 3:
						//console.log('case 3');
						//si hay Others, pelean Others, sino male-female
						if (c.teams.Other.length) {
							params.fighting.push({
								// A: c.teams.Other.splice(Math.floor(Math.random() * c.teams.Other.length), 1)[0],
								// B: c.teams.F.splice(Math.floor(Math.random() * c.teams.F.length), 1)[0],
								A: c.teams.Other[Math.floor(Math.random() * c.teams.Other.length)],
								B: c.teams.F[Math.floor(Math.random() * c.teams.F.length)],
							});
							break;
						}
					default:
						//console.log('case 1');
						params.fighting.push({
							// A: c.teams.M.splice(Math.floor(Math.random() * c.teams.M.length), 1)[0],
							// B: c.teams.F.splice(Math.floor(Math.random() * c.teams.F.length), 1)[0],
							A: c.teams.M[Math.floor(Math.random() * c.teams.M.length)],
							B: c.teams.F[Math.floor(Math.random() * c.teams.F.length)],
						});
						break;
				}
			}

			//TODO: CODIGO PARA EMPUJAR EQUIPO.
			//NO PARA PREPARAR LA LOGICA.
			// c.teams.M.forEach((team, index) => {
			// 	if (this.MIGRATION_PROB < getProb()) {
			// 		//cojo una id de las connections y meto a la ciudad alli.
			// 		let idNewCity = c.connections[rand(0, c.connections.length - 1)];
			// 		this.cities.forEach((citySearched) => {
			// 			if (citySearched.id === idNewCity) { //si estoy en la ciudad que quiero...
			// 				citySearched.teams.M.push(c.teams.M.splice(index, 1)[0]); //saco de mi Teams el equipo y te lo meto.
			// 			}
			// 		});
			// 	}
			// });

			//compruebo si cada equipo restante se va.
			//params.moving
			c.teams.M.forEach((team, index) => {
				if (this.MIGRATION_PROB < getProb()) {
					params.moving.push({
						from: c.id,
						to: c.connections[rand(0, c.connections.length - 1)],
						team: team,
						type: 'M',
					});
				}
			});

			//compruebo si cada equipo restante se va.
			c.teams.F.forEach((team, index) => {
				if (this.MIGRATION_PROB < getProb()) {
					params.moving.push({
						from: c.id,
						to: c.connections[rand(0, c.connections.length - 1)],
						team: team,
						type: 'F',
					});
				}
			});

			//compruebo si cada equipo restante se va.
			c.teams.Other.forEach((team, index) => {
				if (this.MIGRATION_PROB < getProb()) {
					params.moving.push({
						from: c.id,
						to: c.connections[rand(0, c.connections.length - 1)],
						team: team,
						type: 'Other',
					});
				}
			});

			//Inserto en el array los parametros calculados.
			turnParams.push(params);
		});

        console.log("a");

		//Procesar
		turnParams.forEach(async (turnParam, index) => {
			turnParam.fighting.forEach(async (f) => {
				/*Fight result
                    -1: error ?
                    1: groupA wins
                    2: groupB wins
                    3: draw -stopped before end
                    4: both death.
                */
				let figthResult = await GroupFightByIds(f.A.id, f.B.id);

				let query: string = '';

				switch (figthResult) {
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

				await Promise.resolve(() => {
					connection.query(query);
				});
			});
		});

		this.listCities();

		//Descargar
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

	getProb: () => number = () => Math.random();
}
