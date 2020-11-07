// DB
import { createWatchCompilerHost } from 'typescript';
import { connection } from '../config/database';
import { IHero } from '../interfaces/Hero.Interface';

let createCrews = (crews: string[]) => {
	let query = `INSERT INTO crew VALUES `;
	crews.forEach((newValue: string, i: number) => {
		if (i !== 0) {
			query += ',';
		}
		query += `(NULL, "${newValue}")`;
	});
	query += ';';

	return new Promise((res, rej) => {
		connection.query(query, (err, result) => {
			if (err) {
				rej(err);
			}
			console.log(result.insertId);
		});
	});
};

let getCrewByCrewId = (id_crew: number) => {
	let query = `SELECT * FROM hero WHERE id_crew = ${id_crew};`;

	return new Promise((res, rej) => {
		connection.query(query, (err, result) => {
			if (err) {
				rej(err);
			}
			res(result);
		});
	});
};

let getRandomCrew = (soldiersNumber: number) => {
	let query = `SELECT * FROM hero
	ORDER BY RAND()
	LIMIT ${soldiersNumber};`;

	return new Promise<IHero[]>((res, rej) => {
		connection.query(query, (err: any, result: IHero[]) => {
			if (err) {
				rej(err);
			}
			res(result);
		});
	});
};

export { createCrews, getCrewByCrewId, getRandomCrew };
