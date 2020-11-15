import { Request, Response } from "express";
import { IHeroStats, IHeroBase } from "../interfaces/Hero.Interface";

// DB
import { connection } from "../config/database";

const classes: string[] = [
  "Arquero",
  "Berserker",
  "Defensor",
  "Esgrimista",
  "Ninja",
  "Paladin",
  "Cazador",
  "Soldado",
  "Ladron"
];
export function getHeroStats(req: Request, res: Response) {
  for (let i = 1; i <= 9; i++) {
    getStatsByClassId(i, (fullMsg: any) => {
      //console.log(fullMsg);
    });
  }

  res.send("Las Estadisticas");
}

//--
let getStatsByClassId = (id_class: number, callBack: any) => {
  let fullMsg: {
    class: string;
    victories: number;
    defeats: number;
    fights: number;
    winrate: number;
    loserate: number;
  } = {
    class: classes[id_class - 1], //-1 porque es el indice
    victories: 0,
    defeats: 0,
    fights: 0,
    winrate: 0,
    loserate: 0
  };
  let sql = ` select count(id_winner) as victories from battle_information 
    where ((id_winner = id_hero1) AND id_class1 = ${id_class}) 
    OR ((id_winner = id_hero2) AND id_class2 = ${id_class}) 
    AND id_class1 <> id_class2 
    AND id_winner IS NOT NULL`;

  connection.query(sql, (err, [{ victories }]) => {
    fullMsg.victories = victories; //VICTORIAS
    sql = `select count(id_loser) as defeats
        from battle_information 
        where ((id_loser = id_hero1) AND id_class1 = ${id_class}) 
        OR ((id_loser = id_hero2) AND id_class2 = ${id_class}) 
        AND id_class1 <> id_class2 
        AND id_winner IS NOT NULL;`;

    connection.query(sql, (err, [{ defeats }]) => {
      fullMsg.defeats = defeats; //DERROTAS
      sql = `   select 
(select count(id_winner) 
    from battle_information where 
    ((id_winner = id_hero1) AND id_class1 = ${id_class}) OR 
    ((id_winner = id_hero2) AND id_class2 = ${id_class}) 
    AND id_class1 <> id_class2 
    AND id_winner IS NOT NULL) 
+ ( select count(id_loser) 
    from battle_information where 
    ((id_loser = id_hero1) AND id_class1 = ${id_class}) OR 
    ((id_loser = id_hero2) AND id_class2 = ${id_class}) 
    AND id_class1 <> id_class2 
    AND id_winner IS NOT NULL ) 
    as fights
    from battle_information group by fights;`;
      connection.query(sql, (err, [{ fights }]) => {
        fullMsg.fights = fights;
        fullMsg.winrate = Math.round(
          (victories / fights) * 100 + Number.EPSILON
        );
        fullMsg.loserate = Math.round(
          (defeats / fights) * 100 + Number.EPSILON
        );
        callBack(fullMsg);
      });
    });
  });
};
