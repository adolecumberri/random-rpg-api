import { Request, Response } from 'express';
import { IHeroStats, IHero } from '../interfaces/Hero.Interface';

// DB
import { connection } from '../config/database';
import { Fight2 } from './herojs/fight2';
import { FightAsinchonous } from './herojs/fight';

//common

import { getBaseStats, getClassStats, randName } from '../commonModules/classes';
import {rand} from '../commonModules/utils';

//Get info when controller is created.
let basicStats: IHeroStats | any = Promise.resolve(getBaseStats());
let classStats: ({ id: number; name: string } & IHeroStats)[] | any = Promise.resolve(getClassStats()); // & es una interseccion
let gender = ['female', 'male'];

let ranHero: IHero & IHeroStats;

// -------------------------- FUNCTIONS -------------------------------

//function to generate rand numbers
let rand = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

//funtn to generate rand Name
let randName = (gender: number) => {
	return (
		'' +
		(gender === 1 ? hombres[rand(0, hombres.length)]?.nombre : mujeres[rand(0, mujeres.length)]?.nombre) +
		' ' +
		apellido[rand(0, apellido.length)]?.apellido
	);
};
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
// let createHero = () => {

//   let id_class = rand(0, classStats.length - 1); //ES EL INDICE -> el valor es id_class + 1
//   let choosedClassStats = classStats[id_class];

//   let randHero: ({ id: number; name: string } & IHeroStats)[] | any = {};
//   randHero = { ...getStats(basicStats, choosedClassStats) };
//   randHero["id_class"] = id_class + 1; //choosedClassStats["name"];
//   randHero["gender"] = rand(0, 1);
//   randHero["name"] = randName(randHero["gender"]);
//   // Correcciones de decimales
//   randHero["hp"] = Math.round(randHero["hp"]);
//   randHero["currentHp"] = randHero.hp;
//   randHero["dmg"] = Math.round(randHero["dmg"]);
//   randHero["def"] = Math.round(randHero["def"]);
//   return randHero;
// };

// export function getRanHero(req: Request, res: Response) {
//    for (let i = 0; i < 3000; i++) {
//      saveHero(createHero());
//   }
//   res.send("Antes aquí se creaban Heroes");
// }

// export function fightWithTurns (req: Request, res: Response){
//   getHeroes(2, (heroes: any[]) => {
//     let fight = new Fight2(heroes[0], heroes[1]);
//     fight.fight();
//    });

//    res.sendStatus(200);
//   }

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
