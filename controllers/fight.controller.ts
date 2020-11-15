import { Request, Response, NextFunction } from 'express';
import { getHeroById, getRandomHero, getRandomHeroByClass, switchClass } from '../commonModules/heros';
import { pvp } from './herojs/fight';

export async function fight1v1({ params }: Request, res: Response) {
	let { id1, id2 } = params;
	let hero1 = switchClass(await getHeroById(Number(id1)));
	let hero2 = switchClass(await getHeroById(Number(id2)));

	pvp(hero1, hero2);

	res.sendStatus(200);
}

export async function fight1v1Random({ params }: Request, res: Response) {
	let hero1 = switchClass(await getRandomHero());
	let hero2 = switchClass(await getRandomHero());

	pvp(hero1, hero2);

	res.sendStatus(200);
}

export async function fight1v1Recursive({ params }: Request, res: Response) {
	let { id1, id2, times } = params;
	let hero1 = switchClass(await getHeroById(Number(id1)));
	let hero2 = switchClass(await getHeroById(Number(id2)));

	for (let i = 0; i < Number(times); i++) {
		await pvp(hero1, hero2);
		hero1 = switchClass(await getHeroById(Number(id1)));
		hero2 = switchClass(await getHeroById(Number(id2)));
	}

	res.sendStatus(200);
}

export async function fightToGenerateStats({ params }: Request, res: Response) {
	let { id1 } = params;
	let hero1 = switchClass(await getRandomHeroByClass(Number(id1)));
	let hero2 = switchClass(await getRandomHeroByClass(1));

	for (let i = 1; i <= 9; i++) {
		for (let j = 1; j < 1001; j++) {
			await pvp(hero1, hero2);
			hero1 = switchClass(await getRandomHeroByClass(Number(id1)));
			hero2 = switchClass(await getRandomHeroByClass(i));
			console.log(j);
		}
	}

	res.sendStatus(200);
}
