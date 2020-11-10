import { Express, Request, Response, NextFunction } from 'express';

import { getRandomCrew, getSelectedCrew } from '../commonModules/crew';
import { IHero } from '../interfaces/Hero.Interface';
import { AnyHero } from './herojs/classes';

//Not Used
declare global {
	interface Array<T> {
		move(from: number, to: number): any[];
		findThisTurnFighters(turn: number): any[];
	}
}

Array.prototype.move = function (from: number, to: number) {
	this.splice(to, 0, this.splice(from, 1)[0]);
	return this;
};

Array.prototype.findThisTurnFighters = function (turn: number) {
	return this.filter((hero) => hero.heroStats.att_interval === turn);
};
//end Not Used

export async function randomGroupFight({ params }: Request, res: Response) {
	let groupSize = params.groupSize; //TODO: checkear si es un numero y si puede no viene

	let crew1 = await getRandomCrew(Number(groupSize));
	let crew2 = await getRandomCrew(Number(groupSize));

	//Ordeno los equipos.
	crew1.sort((a, b) => a.heroStats.att_interval - b.heroStats.att_interval);
	crew2.sort((a, b) => a.heroStats.att_interval - b.heroStats.att_interval);

	//If the same is in both groups. Reload.
	let flag = true;
	while (flag) {
		crew1.forEach((hero: AnyHero) => {
			flag = crew2.some((hero2) => hero2.heroStats.id === hero.heroStats.id);
		});
		if (flag) {
			crew2 = await getRandomCrew(Number(groupSize));
		}
	}

	//Group Fight.
	crew1.forEach((hero) => {
		console.log(hero.heroStats.id + ': ' + hero.heroStats.name + ' --- ' + hero.heroStats.att_interval);
	});

	let att_counters = crew1.map((hero) => {
		return { id: hero.heroStats.id, attacks: 0 };
	});

	let iterations = 0;
	console.time('f');

	let totalAttackers = 0;
	let attackers1 = [];
	let attackers2 = [];
	let deffenders1 = [];
	let deffenders2 = [];

	for (let i = 1; i <= 100; i++) {
		attackers1 = crew1.findThisTurnFighters(i);
		if (attackers1.length) {
			console.log('TURNO: ' + i);
			console.log(attackers1.length);
			totalAttackers += attackers1.length;
		}

		let flag = false;
		for (let j = 0; j < crew1.length && !flag; j++) {
			if (crew1[j].heroStats.att_interval > i) {
				//Esto es si lo ordeno
				flag = true;
			} else {
				let flag2 = false;
				for (let k = 0; k < att_counters.length && !flag2; k++) {
					if (att_counters[k].id === crew1[j].heroStats.id) {
						att_counters[k].attacks++;
						flag2 = true;
						//Aqui iría move
					}
					iterations++;
				}
				crew1[j].heroStats.att_interval += crew1[j].heroStats.curr_att_interval as number;
			}
		}

		//attackers1 = []; //Probar a no vaciarlo.
	}

	console.timeEnd('f');
	console.log('iterations: ' + iterations);
	console.log('totalAttackers', totalAttackers);
	att_counters.forEach((hero) => {
		console.log(hero.id + ' --- ' + hero.attacks);
	});

	// crew2.forEach( (hero) => {
	// 	console.log(hero.id + ": " + hero.name + " --- " + hero.att_interval);
	// })

	res.send(flag);
}
