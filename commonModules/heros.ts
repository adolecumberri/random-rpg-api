import { connection } from '../config/database';
import { IHeroStats } from '../interfaces/Hero.Interface';
import { rand } from './utils';

import {
	Archer,
	Berserker,
	Defender,
	Fencer,
	Ninja,
	Paladin,
	Sniper,
	Soldier,
	Thieve,
} from '../controllers/herojs/classes';

//CONST NOMBRES + APELLIDOS
const HOMBRES = require('../jsons/commun/hombres');
const MUJERES = require('../jsons/commun/mujeres');
const APELLIDOS = require('../jsons/commun/apellidos');
const VARIATION = 0.15;
//Get info when controller is created.

let randName = (gender: number) => {
	return [
		gender === 1 ? HOMBRES[rand(0, HOMBRES.length)] : MUJERES[rand(0, MUJERES.length)],
		APELLIDOS[rand(0, APELLIDOS.length - 1)],
	];
};

//Estadisticas Basicas de la base de datos
// una promesa y una llamada que devuelve estadisticas bases.
let getBaseStats = () => {
	return new Promise((res, rej) => {
		let query =
			'SELECT hp, dmg, def, crit, critDmg, accuracy, evasion, att_interval, reg FROM statistics where id_class IS NULL;';
		connection.query(query, (err, result: IHeroStats[]) => {
			if (err) {
				return rej(err);
			}
			res(result[0]);
		});
	});
};

//Estadisticas De las Clases
let getClassStats = () => {
	return new Promise((resolve, reject) => {
		let query = `SELECT class.id, name, hp, dmg, def, crit, critDmg, accuracy, evasion, att_interval, reg 
		FROM statistics inner join class on statistics.id_class = class.id ;`;
		connection.query(query, (err, result: ({ id: number; name: string } & IHeroStats)[]) => {
			if (err) {
				return reject(err);
			}
			resolve([...result]);
		});
	});
};

//Coger heroe 0,0
let getRandomHero = () => {
	return new Promise((resolve, reject) => {
		let query = `SELECT * FROM hero WHERE id_class = 2 ORDER BY RAND() LIMIT 1;`;
		connection.query(query, (err, result: ({ id: number; name: string } & IHeroStats)[]) => {
			if (err) {
				return reject(err);
			}
			resolve(result[0]);
		});
	});
};

let calculateFinalStats = (baseStats: any, classState: any) => {
	let finalStat: any = {};
	Object.keys(baseStats).map((a: string | any) => {
		let value = baseStats[a] + classState[a] + Number.EPSILON;
		finalStat[a] =
			Math.round((Math.random() * (value * (1 + VARIATION) - value * (1 - VARIATION)) + value * (1 - VARIATION)) * 100) /
			100;
	});
	return finalStat;
};

let switchClass = (hero: any) => {
	let solution: Archer | Berserker | Defender | Fencer | Ninja | Paladin | Sniper | Soldier | undefined = undefined;
	switch (hero.id_class) {
		case 1:
			solution = new Archer(hero);
			break;
		case 2:
			solution = new Berserker(hero);
			break;
		case 3:
			solution = new Defender(hero);
			break;
		case 4:
			solution = new Fencer(hero);
			break;
		case 5:
			solution = new Ninja(hero);
			break;
		case 6:
			solution = new Paladin(hero);
			break;
		case 7:
			solution = new Sniper(hero);
			break;
		case 8:
			solution = new Soldier(hero);
			break;
		case 9:
			solution = new Thieve(hero);
			break;
	}

	return solution as Archer | Berserker | Defender | Fencer | Ninja | Paladin | Sniper | Soldier;
};

export { getBaseStats, getClassStats, randName, calculateFinalStats, switchClass, getRandomHero };
