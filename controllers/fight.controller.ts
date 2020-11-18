import { Request, Response, NextFunction } from 'express';
import { getCrewByClassId } from '../commonModules/crew';
import { getHeroById, getRandomHero, getRandomHeroByClass, switchClass } from '../commonModules/heros';
import { IHero } from '../interfaces/Hero.Interface';
import { AnyHero } from './herojs/classes';
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

export async function fightToGenerateStatsWithGroups({ params }: Request, res: Response) {
	let { id1, id2, howmany } = params;
	//loop to switcClass
	let hero1: (IHero | AnyHero)[] = await getCrewByClassId(Number(id1), Number(howmany));
	hero1.forEach((o, i, a) => (a[i] = switchClass(o))); //Create a class forEach IHero brought from bbdd

	let hero2: (IHero | AnyHero)[] = await getCrewByClassId(Number(id2), Number(howmany));
	hero2.forEach((o, i, a) => (a[i] = switchClass(o))); //Create a class forEach IHero brought from bbdd
	let pvps: any = [];

	for (let j = 0; j < Number(howmany); j++) {
		pvps.push(await pvp(hero1[j] as AnyHero, hero2[j] as AnyHero));
	}

	Promise.all(pvps);

	res.sendStatus(200);
}
