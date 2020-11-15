import { Request, Response, NextFunction } from 'express';
import { getRandomHero, switchClass } from '../commonModules/heros';

export async function fight1v1({ params }: Request, res: Response) {
	//carga de la clase de cada heroe
	let hero1 = switchClass(await getRandomHero());
	let hero2 = switchClass(await getRandomHero());

	if (hero1.heroStats.id_class === 7) {
		hero2.defend(hero1);
	}
	if (hero2.heroStats.id_class === 7) {
		hero1.defend(hero2);
	}

	for (let i = 0; !hero1.isDead && !hero1.isDead && i < 1000; i++) {
		if (hero1.heroStats.curr_att_interval === i) {
			//ataca hero1
			hero2.defend(hero1);
		}
		if (hero2.heroStats.curr_att_interval === i) {
			//ataca hero2
			hero1.defend(hero2);
		}
	}

	//Guardar en la base de datos
	if (hero1.isDead || hero1.isDead) {
		//	saveSingleFight(fightStats, hero1, hero2);
	}

	res.sendStatus(200);
}
