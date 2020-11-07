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

export async function asignCrewsToHero(req: Request, res: Response) {
	let promises: any[] = [];

	APELLIDOS.forEach((apellido: string, index: number) => {
		let query = `UPDATE hero
		SET id_crew = ${index}
		WHERE surname like "${apellido}" AND gender = 1;`;
		console.log(query);
		promises.push(
			connection.query(query, () => {
				console.log('inserted i');
			})
		);
		let query2 = `UPDATE hero
		SET id_crew = ${index + 153}
		WHERE surname like "${apellido}" AND gender = 0;`;
		console.log(query2);
		promises.push(
			connection.query(query2, () => {
				console.log('inserted i');
			})
		);
	});
	Promise.all(promises);

	res.sendStatus(200);
}

export async function getCrew({ params }: Request, res: Response) {
	let id_crew = params.id_crew; //TODO: checkear si es un numero y si puede no viene

	let crew = await getCrewByCrewId(Number(id_crew));
	res.send(JSON.stringify(crew));
}

// export { createCrewsByGender };
