import { Request, Response } from 'express';
import { IHeroStats, IHeroBase, IHeroCreated } from '../interfaces/Hero.Interface';

// DB
import { connection } from '../config/database';
import { Fight2 } from './herojs/fight2';
import { FightAsinchonous } from './herojs/fight';

//common

import { getBaseStats, getClassStats, randName, calculateFinalStats } from '../commonModules/heros';
import { rand } from '../commonModules/utils';
import { FieldInfo, MysqlError, queryCallback } from 'mysql';
import { fight } from './fight.controller';

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
	// console.time('createHero');
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
	randHero['currentHp'] = randHero.hp;
	randHero['dmg'] = Math.round(randHero['dmg']);
	randHero['def'] = Math.round(randHero['def']);
	console.log(`Random Hero: \n ${JSON.stringify(randHero.name)}`);
	// console.timeEnd('createHero');
	return randHero as IHeroCreated;
};

//param :numberToCreate : number
let createHeros = async (req: Request, res: Response) => {
	console.time('createHero2');

	//Carga de estadisticas
	basicStats = await getBaseStats();
	classStats = await getClassStats();

	let numberToCreate = req.params.numberToCreate;
	let promises = [];
	for (let i = 0; i < Number(numberToCreate); i++) {
		promises.push(saveHero(createHero()));
	}
	Promise.all(promises);
	/*
	Si quiero hacer algo despues, puedo hacer
	Promise.all(promises).then(Codigo para despues.)
	*/
	console.timeEnd('createHero2');
	res.send('Antes aquí se creaban Heroes');
};

let saveHero = (hero: any) => {
	// console.time('saveHeros');
	connection.query('INSERT INTO hero SET ?', [hero], (err: MysqlError | null, result: any) => {
		console.log(result.insertId);
	});
	// console.timeEnd('saveHeros');
};

// const getHeroes = (num: number, callback: any) => {
// 	connection.query(`SELECT * FROM hero WHERE isAlive = 1 AND kills = 0 ORDER BY RAND() LIMIT ${num}`, (err, result) => {
// 		callback(result);
// 	});
// };

const getHeroesTricky = () => {
	let query = `SELECT * FROM hero WHERE id = 143 OR id = 144;`;
	console.log(query);
	return new Promise((res, rej) => {
		connection.query(query, (err, result: IHeroStats[]) => {
			if (err) {
				return rej(err);
			}
			console.log(result);
			res(result);
		});
	});
};

const fight2heros = async (req: Request, res: Response) => {
	let heroes: any = await getHeroesTricky();
	console.log('my heroes:');
	console.log(JSON.stringify(heroes[0]));
	console.log(JSON.stringify(heroes[1]));

	fight(heroes[0], heroes[1]);

	res.sendStatus(200);
};

export { createHeros, fight2heros };
// export function fightAsinc(req: Request, res: Response) {

//   for(let i = 0; i < 3000; i++){
//     getHeroes(2, (heroes: any[]) => {
//       let fight = new FightAsinchonous(heroes[0], heroes[1]);
//       fight.fight();
//      });
//   }

//   res.send("La movida");
// }

// /* --------------- HEROES FIGHT ----------- */
// const getHeroes = (num: number, callback: any) => {
//   connection.query(
//     `SELECT * FROM hero WHERE isAlive = 1 AND kills = 0 ORDER BY RAND() LIMIT ${num}`,
//     (err, result) => {
//       callback(result);
//     }
//   );
// };

// let saveHero = (hero: any) => {
//   connection.query("INSERT INTO hero SET ?", [hero]);
// };
