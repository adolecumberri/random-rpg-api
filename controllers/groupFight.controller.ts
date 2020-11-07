import { Express, Request, Response, NextFunction } from 'express';

import { getRandomCrew } from '../commonModules/crew';
import { IHero } from '../interfaces/Hero.Interface';

export async function randomGroupFight({ params }: Request, res: Response) {
	let groupSize = params.groupSize; //TODO: checkear si es un numero y si puede no viene

	let crew1 = await getRandomCrew(Number(groupSize));
	let crew2 = await getRandomCrew(Number(groupSize));

	//Ordeno los equipos.
	crew1.sort((a, b) => a.att_interval - b.att_interval);
	crew2.sort((a, b) => a.att_interval - b.att_interval);

	//If the same is in both groups. Reload.
	let flag = true;
	while (flag) {
		crew1.forEach((hero: IHero) => {
			flag = crew2.some((hero2) => hero2.id === hero.id);
		});
		if (flag) {
			crew2 = await getRandomCrew(Number(groupSize));
		}
	}

	//Group Fight.
	crew1.forEach((hero) => {
		console.log(hero.id + ': ' + hero.name + ' --- ' + hero.att_interval);
	});

	let att_counters = crew1.map((hero) => {
		return { id: hero.id, attacks: 0 };
	});

	for(let i = 1 ; i <= 100; i++){

		let flag = false;
		for(let j = 0; j < crew1.length && !flag; j++){
			if(crew1[j].att_interval > i){
				flag = true;
			}else{
				let flag2 = false;
				for(let k = 0; k < att_counters.length && !flag2; k++){
					if(att_counters[k].id === crew1[j].id){
						att_counters[k].attacks++;
						flag2 = true;
					}
				}
			}
		}

	}


	att_counters.forEach((hero) => {
		console.log(hero.id + ' --- ' + hero.attacks);
	});


	// crew2.forEach( (hero) => {
	// 	console.log(hero.id + ": " + hero.name + " --- " + hero.att_interval);
	// })

	res.send(flag);
}
