import { Express, Request, Response, NextFunction } from 'express';

import { getRandomCrew, getSelectedCrew } from '../commonModules/crew';
import { rand } from '../commonModules/utils';
import { IHero } from '../interfaces/Hero.Interface';
import { HeroGroup } from './groupjs/group';
import { AnyHero } from './herojs/classes';
import { teamFight } from './herojs/fight';

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

export async function randomGroupFight(req: Request, res: Response) {
	console.time('f');
	let { howmany } = req.params;
	//Cojo Rando crew
	let hero1:  AnyHero[] = await getRandomCrew(Number(howmany), false);
	let hero2: AnyHero[] = await getRandomCrew(Number(howmany), false);

	//Creo los grupos
	let groupA: HeroGroup  = new HeroGroup(hero1);
	let groupB: HeroGroup = new HeroGroup(hero2); 

	await teamFight(groupA, groupB);

	// await Promise.all(pvps).then(() => console.log('Done?'));

	console.timeEnd('f');
	res.sendStatus(200);
}


