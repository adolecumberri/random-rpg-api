import { Request, Response } from 'express';
import { IHeroStats, IHeroBase, IHeroCreated } from '../interfaces/Hero.Interface';

// DB
import { connection } from '../config/database';

//common

import { getBaseStats, getClassStats, randName, calculateFinalStats } from '../commonModules/heros';
import { rand } from '../commonModules/utils';
import { FieldInfo, MysqlError, queryCallback } from 'mysql';
import { fight1v1 } from './fight.controller';


//Get info when controller is created.
let basicStats: IHeroStats | any;
let classStats: ({ id: number; name: string } & IHeroStats)[] | any; // & es una interseccion
let gender = ['female', 'male'];

let ranHero: IHeroBase & IHeroStats;

// -------------------------- FUNCTIONS -------------------------------

//get Stats and calculate them  over and under 15%
// let getStats = async (choosedClass: number) => {
// 	let obj: any = {};
// 	Object.keys(basicStats).map((a: string | any) => {
// 		let value = baseStats[a] + choosedClassStats[a] + Number.EPSILON;
// 		obj[a] = Math.round((Math.random() * (value * 1.15 - value * 0.85) + value * 0.85) * 100) / 100;
// 	});
// 	return obj;
// };

//Crear heroe
let createHero = () => {
	// //console.time('createHero');
	let id_class = rand(0, classStats.length - 1); //ES EL INDICE -> el valor es id_class + 1
	let choosedClassStats = classStats[id_class];
	let currGender = rand(0, 1);
	let name = randName(Number(currGender));
	let randHero: IHeroCreated = {
		...calculateFinalStats(basicStats, choosedClassStats),
		id_class: id_class + 1,
		gender: currGender,
		name: name[0],
		surname: name[1]
	};
	randHero['hp'] = Math.round(randHero['hp']);
	//randHero['currentHp'] = randHero.hp;
	randHero['dmg'] = Math.round(randHero['dmg']);
	randHero['def'] = Math.round(randHero['def']);
	//console.log(`Random Hero: \n ${JSON.stringify(randHero.name)}`);
	// //console.timeEnd('createHero');
	return randHero as IHeroCreated;
};

//param :numberToCreate : number
let createHeros = async (req: Request, res: Response) => {
	//console.time('createHero2');

	//Carga de estadisticas
	basicStats = await getBaseStats();
	classStats = await getClassStats();

	let numberToCreate = req.params.numberToCreate;
	let promises = [];
	for (let i = 0; i < Number(numberToCreate); i++) {
		promises.push(saveHero(createHero()));
	}
	Promise.all(promises);
	res.send('Antes aquí se creaban Heroes');
};

let saveHero = (hero: any) => {
	connection.query('INSERT INTO hero SET ?', [hero], (err: MysqlError | null, result: any) => {
		console.log(`created ${result.insertId}`);
	});
};


const getHeroesTricky = () => {
	let query = `SELECT * FROM hero WHERE id = 143 OR id = 144;`;
	return new Promise((res, rej) => {
		connection.query(query, (err, result: IHeroStats[]) => {
			if (err) {
				return rej(err);
			}
			res(result);
		});
	});
};

const fight2heros = async (req: Request, res: Response) => {
	let heroes: any = await getHeroesTricky();

	fight1v1(heroes[0], heroes[1]);

	res.sendStatus(200);
};

export { createHeros, fight2heros };
