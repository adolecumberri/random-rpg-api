import { Express, Request, Response, NextFunction } from 'express';

import { getRandomCrew, getSelectedCrew } from '../commonModules/crew';
import { rand } from '../commonModules/utils';
import { IHero } from '../interfaces/Hero.Interface';
import { HeroGroup } from './groupjs/group';
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

	let crew1 = new HeroGroup(await getRandomCrew(Number(groupSize)));
	let crew2 = new HeroGroup(await getRandomCrew(Number(groupSize)));

	//Ordeno los equipos.
	crew1.orderByStats('att_interval');
	crew2.orderByStats('att_interval');

	//If the same is in both groups. Reload.
	let flag = true;
	while (flag) {
		crew1.heros.forEach((hero: AnyHero) => {
			flag = crew2.heros.some((hero2) => hero2.heroStats.id === hero.heroStats.id);
		});
		if (flag) {
			crew2.setHeros(await getRandomCrew(Number(groupSize)));
		}
	}

	//Group Fight.
	crew1.heros.forEach((hero) => {
		//console.log(hero.heroStats.id + ': ' + hero.heroStats.name + ' --- ' + hero.heroStats.att_interval);
	});

	let att_counters = crew1.heros.map((hero) => {
		return { id: hero.heroStats.id, attacks: 0 };
	});

	let iterations = 0;
	//console.time('f');

	let generalFightStats = {
		muertos: [], //{id_muerto, id_asesino, turno}
	};

	let attackers1: AnyHero[] = [];
	let attackers2: AnyHero[] = [];
	let deffenders1: AnyHero[] = [];
	let deffenders2: AnyHero[] = [];

	attackers1 = crew1.getHerosByClass(7); //snipers
	attackers2 = crew2.getHerosByClass(7); //snipers

	attackers1.forEach((heroAttacker) => {});

	for (let i = 1; i <= 100; i++) {
		//Attacantes. si att_interval === i
		attackers1 = crew1.heros.findThisTurnFighters(i);
		attackers2 = crew2.heros.findThisTurnFighters(i);

		//cargar Deffenders.
		if (attackers1.length) {
			for (let j = 0; j < attackers1.length; j++) {
				let heroSelected = crew2.heros[rand(0, crew2.heros.length - 1)]; //cojo un heroe del equipo contrario

				while (deffenders2.some((e) => e && e.heroStats.id === heroSelected.heroStats.id)) {
					heroSelected = attackers1[rand(0, attackers1.length - 1)];
				}
				deffenders2.push(heroSelected);
			}
		}

		//cargar Deffenders.
		if (attackers2.length) {
			for (let j = 0; j < attackers2.length; j++) {
				let heroSelected = crew1.heros[rand(0, crew1.heros.length - 1)]; //cojo un heroe del equipo contrario

				while (deffenders1.some((e) => e && e.heroStats.id === heroSelected.heroStats.id)) {
					heroSelected = attackers2[rand(0, attackers2.length - 1)];
				}
				deffenders1.push(heroSelected);
			}
		}

		let flag = false;
		for (let j = 0; j < crew1.heros.length && !flag; j++) {
			if (crew1.heros[j].heroStats.att_interval > i) {
				//Esto es si lo ordeno
				flag = true;
			} else {
				let flag2 = false;
				for (let k = 0; k < att_counters.length && !flag2; k++) {
					if (att_counters[k].id === crew1.heros[j].heroStats.id) {
						att_counters[k].attacks++;
						flag2 = true;
						//Aqui iría move
					}
					iterations++;
				}
				crew1.heros[j].heroStats.att_interval += crew1.heros[j].heroStats.curr_att_interval as number;
			}
		}

		//reseteo de vars
		attackers1 = []; //Probar a no vaciarlo.
		attackers2 = [];
		deffenders1 = [];
		deffenders2 = [];
	}

	//console.timeEnd('f');
	//console.log('iterations: ' + iterations);
	att_counters.forEach((hero) => {
		//console.log(hero.id + ' --- ' + hero.attacks);
	});

	// crew2.forEach( (hero) => {
	// 	//console.log(hero.id + ": " + hero.name + " --- " + hero.att_interval);
	// })

	res.send(flag);
}
