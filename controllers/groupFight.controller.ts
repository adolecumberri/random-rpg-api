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

export async function randomGroupFight(req: Request, res: Response) {
	let { howmany } = req.params;
}
