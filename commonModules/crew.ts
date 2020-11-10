// DB
import { createWatchCompilerHost } from 'typescript';
import { connection } from '../config/database';
import { AnyHero } from '../controllers/herojs/classes';
import { IHero } from '../interfaces/Hero.Interface';
import { switchClass } from './heros';

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

	return new Promise<AnyHero[]>((res, rej) => {
		connection.query(query, (err: any, result: IHero[]) => {
			if (err) {
				rej(err);
			}

			let herosResult: any[] = result.map((o, i, herosArr) =>
				switchClass({ ...herosArr[i], curr_att_interval: o.att_interval })
			);
			res(herosResult);
		});
	});
};

let getSelectedCrew = (ids: number[]) => {
	let query = `SELECT * FROM hero
	WHERE `;

	ids.forEach((id, i) => {
		console.log('i: ' + i);
		if (i === 0) {
			query += ` id = ${id}`;
		} else {
			query += ` OR id = ${id}`;
		}
	});
	query += ';';

	return new Promise<AnyHero[]>((res, rej) => {
		connection.query(query, (err: any, result: IHero[]) => {
			if (err) {
				rej(err);
			}

			let herosResult: any[] = result.map((o, i, herosArr) =>
				switchClass({ ...herosArr[i], curr_att_interval: o.att_interval })
			);
			res(herosResult);
		});
	});
};

export { createCrews, getCrewByCrewId, getRandomCrew, getSelectedCrew };
