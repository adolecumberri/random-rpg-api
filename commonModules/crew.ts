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
			//console.log(result.insertId);
		});
	});
};

let getCrewByCrewId = (id_crew: number) => {
	
	let query = `select hero.* from hero
	left join heros_crew
	on hero.id = heros_crew.id_hero
	where heros_crew.id_crew = ${id_crew};`;
	console.log('query', query);
	return new Promise<AnyHero[]>((res, rej) => {
		connection.query(query, (err, result: IHero[]) => {
			if (err) {
				rej(err);
			}
			if (result === undefined) {
				console.log(query);
				console.log(id_crew, 'gives result undefined: ', result);
			}

			let herosResult: any[] = result.map((o, i, herosArr) =>
				switchClass({ ...herosArr[i], curr_att_interval: o.att_interval })
			);
			res(herosResult);
		});
	});
};

//get crew by id, but takes on consideration currentHp from the table heros_crew.
let getCrewByCrewIdInEvent = (id_crew: number) => {
	
	let query = `select hero.*, heros_crew.currentHp as currenthp from hero
	left join heros_crew
	on hero.id = heros_crew.id_hero
	where heros_crew.id_crew = ${id_crew};`;
	console.log('query', query);
	return new Promise<AnyHero[]>((res, rej) => {
		connection.query(query, (err, result: IHero[]) => {
			if (err) {
				rej(err);
			}
			if (result === undefined) {
				console.log(query);
				console.log(id_crew, 'gives result undefined: ', result);
			}

			let herosResult: any[] = result.map((o, i, herosArr) =>
				switchClass({ ...herosArr[i], curr_att_interval: o.att_interval })
			);
			res(herosResult);
		});
	});
};

let getCrewByClassId = (id_class: number, howMany: number) => {
	let query = `SELECT * FROM hero WHERE id_class = ${id_class} LIMIT ${howMany};`;

	return new Promise<IHero[]>((res, rej) => {
		connection.query(query, (err, result: IHero[]) => {
			if (err) {
				rej(err);
			}
			res(result);
		});
	});
};

let getRandomCrew: (soldiersNumber: number, neverFought?: boolean) => Promise<AnyHero[]> = (
	soldiersNumber,
	neverFought = true
) => {
	let query = `SELECT * FROM hero
	${neverFought ? '' : 'WHERE deaths = 0 AND kills = 0'}
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
		//console.log('i: ' + i);
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

export { createCrews, getCrewByCrewId, getRandomCrew, getSelectedCrew, getCrewByClassId, getCrewByCrewIdInEvent };
