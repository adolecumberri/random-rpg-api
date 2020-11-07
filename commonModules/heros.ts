import { connection } from '../config/database';
import { IHeroStats } from '../interfaces/Hero.Interface';
import { rand } from './utils';

//CONST NOMBRES + APELLIDOS
const HOMBRES = require('../jsons/commun/hombres');
const MUJERES = require('../jsons/commun/mujeres');
const APELLIDOS = require('../jsons/commun/apellidos');
const VARIATION = 0.15;
//Get info when controller is created.

let randName = (gender: number) => {
	return [
		gender === 1 ? HOMBRES[rand(0, HOMBRES.length)] : MUJERES[rand(0, MUJERES.length)],
		APELLIDOS[rand(0, APELLIDOS.length -1)],
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

export { getBaseStats, getClassStats, randName, calculateFinalStats };
