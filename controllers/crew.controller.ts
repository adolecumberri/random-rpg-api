import { Express, Request, Response, NextFunction } from 'express';
import { connection } from '../config/database';

const APELLIDOS = require('../jsons/commun/apellidos');

import { createCrews, getCrewByCrewId } from '../commonModules/crew';
//param :numberToCreate : number

export async function createCrewsByGender(req: Request, res: Response) {
	let crewHombres: string[] = [];
	let crewMujeres: string[] = [];

	APELLIDOS.forEach((apellido: string) => {
		crewHombres.push(`LOS ${apellido}`);
		crewMujeres.push(`LAS ${apellido}`);
	});

	createCrews(crewHombres.concat(crewMujeres));
	res.sendStatus(200);
}


// inserta en heros_crew los ids de los heroes con  su correspondiente equipo.
//TODO: controlar las id_crew insertadas. Cuando no empiecen por 1, habrá que meter un paso intermedio creo.
export async function asignCrewsToHerBySurname(req: Request, res: Response) {
	let evento = req.params.event;
	let promises: any[] = [];

	APELLIDOS.forEach(async (apellido: string, index: number) => {
		let idsMale: any[] = [];

		console.log({ apellido });
		await (async () => {
			await new Promise((resolve, reject) => {
				let q = `select id from hero where surname like "${apellido}" AND gender = 1`;
				connection.query(q, async (err, result) => {
					idsMale = result;
					resolve(true);
				});
			});
		})();

		let query = `INSERT INTO heros_crew
		VALUES `;

		idsMale.forEach((id, i) => {
			query += `(${index + 1}, ${id.id} )`;
			if (i !== idsMale.length - 1) {
				query += `,`;
			} else {
				query += `;`;
			}
		});

		console.log(query);

		promises.push(
			new Promise((res, rej) => {
				connection.query(query, (err, result) => {
					res('done');
				});
			})
		);
	});

	APELLIDOS.forEach(async (apellido: string, index: number) => {
		let idsFemale: any[] = [];
		await (async () => {
			await new Promise((resolve, reject) => {
				let q = `select id from hero where surname like "${apellido}" AND gender = 0`;
				connection.query(q, async (err, result) => {
					idsFemale = result;
					resolve(true);
				});
			});
		})();

		let query = `INSERT INTO heros_crew
		VALUES `;

		idsFemale.forEach((id, i) => {
			query += `(${index + 154}, ${id.id} )`;
			if (i !== idsFemale.length - 1) {
				query += `,`;
			} else {
				query += `;`;
			}
		});

		promises.push(
			new Promise((res, rej) => {
				connection.query(query, (err, result) => {
					res('done');
				});
			})
		);
	});

	await Promise.all(promises);

	res.sendStatus(200);
}

export async function getCrew({ params }: Request, res: Response) {
	let id_crew = params.id_crew; //TODO: checkear si es un numero y si puede no viene

	let crew = await getCrewByCrewId(Number(id_crew));
	res.send(JSON.stringify(crew));
}

// export { createCrewsByGender };
