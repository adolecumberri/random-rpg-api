import { Express, Request, Response, NextFunction } from "express";
import { connection } from "../config/database";

const APELLIDOS = require("../jsons/commun/apellidos");

import { createCrews, getCrewByCrewId } from "../commonModules/crew";
//param :numberToCreate : number

export async function createCrewsByGender(req: Request, res: Response) {
  let { eventType } = req.params;

  let result = await createCrews(Number(eventType));
  res.sendStatus(200);
}

// inserta en heros_crew los ids de los heroes con  su correspondiente equipo.
export async function asignCrewsToHerBySurname(req: Request, res: Response) {
  let evento = req.params.event;
  let promises: any[] = [];

  /* id 	surname	side
		1	AGUILAR	MALE
		2	AGUSTIN	MALE
		3	ALONSO	MALE
		4	ALVAREZ	MALE
		5	ANDRES	MALE
		6	ARENAS	MALE
	*/
  let infoCrew: any[] = [];

  await (async () => {
    await new Promise((resolve, reject) => {
      let q = `select id, SUBSTRING(nombre,5) as surname, side from crew where evento = ${Number(
        evento
      )};`;
      console.log(q);
      connection.query(q, async (err, result) => {
        infoCrew = result;
        console.log("ESTRUCTURA INFO CREW");
        console.log(infoCrew);
        resolve(true);
      });
    });
  })();

  //infoCrew.filter( b =>b.surname === "REYES" && b.side === "MALE")[0].id

  APELLIDOS.forEach(async (apellido: string, index: number) => {
    let idsMale: { id: number; hp: number }[] = [];
    let idCrew = infoCrew.filter(
      (b) => b.surname === apellido && b.side === "MALE"
    )[0].id;

    await (async () => {
      await new Promise((resolve, reject) => {
        let q = `select id, hp from hero where surname like "${apellido}" AND gender = 1`;
        console.log(q);
        connection.query(q, async (err, result) => {
          idsMale = result;
          resolve(true);
        });
      });
    })();

    let query = `INSERT INTO heros_crew
		VALUES `;

    idsMale.forEach((male, i) => {
      if (male === undefined) {
        debugger;
      }
      query += `(${idCrew}, ${male.id}, 1, ${male.hp} )`;
      if (i !== idsMale.length - 1) {
        query += `,`;
      } else {
        query += `;`;
      }
    });

    console.log(query);

    promises.push(
      new Promise((err, res) => {
        connection.query(query, (err, result) => {
          if (err) throw err;
          res(result);
        });
      })
    );
  });

  //FEMALE
  APELLIDOS.forEach(async (apellido: string, index: number) => {
    try {
      let idsFemale: { id: number; hp: number }[] = [];
      let idCrew = infoCrew.filter(
        (b) => b.surname === apellido && b.side === "FEMALE"
      )[0].id;

      await (async () => {
        await new Promise((resolve, reject) => {
          let q = `select id, hp from hero where surname like "${apellido}" AND gender = 0`;
          connection.query(q, async (err, result) => {
            idsFemale = result;
            resolve(true);
          });
        });
      })();

      let query = `INSERT INTO heros_crew
		VALUES `;

      idsFemale.forEach((female, i) => {
        query += `(${idCrew}, ${female.id}, 1, ${female.hp} )`;
        if (i !== idsFemale.length - 1) {
          query += `,`;
        } else {
          query += `;`;
        }
      });

      console.log(query);
      promises.push(
        new Promise((err, res) => {
          try {
            connection.query(query, (err, result) => {
              if (err) throw err;
              res(result);
            });
          } catch (e) {
            console.log(e);
          }
        })
      );
    } catch (e) {
      console.log(e);
    }
  });

  await Promise.all(promises);

  res.sendStatus(200);
}

export async function getCrew({ params }: Request, res: Response) {
  let id_crew = params.id_crew;

  let crew = await getCrewByCrewId(Number(id_crew));
  res.send(JSON.stringify(crew));
}

// export { createCrewsByGender };
