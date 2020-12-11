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

//TODO: obsoleto
export async function asignCrewsToHero_Obsolete(req: Request, res: Response) {
	let promises: any[] = [];

	APELLIDOS.forEach((apellido: string, index: number) => {
		let query = `UPDATE hero
		SET id_crew = ${index + 1}
		WHERE surname like "${apellido}" AND gender = 1;`;
		//console.log(query);
		promises.push(
			connection.query(query, (err, result) => {
				console.log(`Rows affected: ${result.affectedRows}`);
			})
		);
		let query2 = `UPDATE hero
		SET id_crew = ${index + 153}
		WHERE surname like "${apellido}" AND gender = 0;`;
		//console.log(query2);
		promises.push(
			connection.query(query2, (err, result) => {
				console.log(`Rows affected: ${result.affectedRows}`);
			})
		);
	});
	Promise.all(promises);

	res.sendStatus(200);
}


// TODO: insertar en tabla NM hero_crew las IDs por crew y hero
export async function asignCrewsToHero(req: Request, res: Response) {
	let promises: any[] = [];
	//let query = `INSERT INTO crew VALUES `;

	// APELLIDOS.forEach (async (ape: String, index: number) => {
	// 	let queryToResquestHerosId = `SELECT id FROM hero WHERE apellido like "${ape}" and GENDER = 0`;
		 
	// 	await (async () => {
	// 		let prueba = 'prueba';
	// 		await new Promise((resolve, reject) => {
	// 			connection.query(`insert into groupfight set name = "${prueba}";`, async (err, result) => {
	// 				// console.log(result);
	// 				id_fight = result.insertId as number;
	// 				resolve(true);
	// 			});
	// 		});
	// 	})();
	


	// 	let query = `INSERT INTO heros_crew VALUES `;
	// })



	// APELLIDOS.forEach((apellido: string, index: number) => {
	// 	let query = `UPDATE hero
	// 	SET id_crew = ${index + 1}
	// 	WHERE surname like "${apellido}" AND gender = 1;`;
	// 	//console.log(query);
	// 	promises.push(
	// 		connection.query(query, (err, result) => {
	// 			console.log(`Rows affected: ${result.affectedRows}`);
	// 		})
	// 	);
	// 	let query2 = `UPDATE hero
	// 	SET id_crew = ${index + 153}
	// 	WHERE surname like "${apellido}" AND gender = 0;`;
	// 	//console.log(query2);
	// 	promises.push(
	// 		connection.query(query2, (err, result) => {
	// 			console.log(`Rows affected: ${result.affectedRows}`);
	// 		})
	// 	);
	// });
	// Promise.all(promises);

	res.sendStatus(200);
}

export async function getCrew({ params }: Request, res: Response) {
	let id_crew = params.id_crew; //TODO: checkear si es un numero y si puede no viene

	let crew = await getCrewByCrewId(Number(id_crew));
	res.send(JSON.stringify(crew));
}

// export { createCrewsByGender };
