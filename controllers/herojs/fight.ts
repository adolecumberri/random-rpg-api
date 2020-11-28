import { connection } from '../../config/database';
import { AnyHero } from './classes';

export const pvp: (hero1: AnyHero, hero2: AnyHero) => void = async (hero1, hero2) => {
	//carga de la clase de cada heroe

	let saveFight: (turns: number) => Promise<unknown> = async (turns) => {
		await new Promise((resolve, reject) => {
			connection.query(`insert into fight1v1 set turns = ${turns};`, async (err, result) => {
				await hero1.fightStats.saveStats(result.insertId as number);
				await hero2.fightStats.saveStats(result.insertId as number);

				resolve(true);
			});
		});
	};

	// let saveFight: (turns: number) => void = async (turns) => {
	// 	new Promise((resolve, reject) => {
	// 		connection.query(`insert into fight1v1 set turns = ${turns};`, async (err, result) => {
	// 			resolve(result.insertId);
	// 		});
	// 	}).then( async (a) => {
	// 		console.log(a);
	// 		await hero1.fightStats.saveStats(a as number);
	// 		await hero2.fightStats.saveStats(a as number);
	// 	});
	// };

	if (hero1.heroStats.id_class === 7) {
		hero2.defend(hero1);
	}
	if (hero2.heroStats.id_class === 7) {
		hero1.defend(hero2);
	}
	let i = 0;
	for (; !hero1.isDead && !hero2.isDead; i++) {
		if (hero1.heroStats.curr_att_interval === i) {
			//ataca hero1
			await hero2.defend(hero1);
			hero2.end();
		}
		if (hero2.heroStats.curr_att_interval === i) {
			//ataca hero2
			await hero1.defend(hero2);
			hero1.end();
		}
	}

	//Guardar en la base de datos
	if (hero1.isDead && hero2.isDead) {
		//console.log('draw');
		// console.log(`${hero1.heroStats.id} ---- ${hero2.heroStats.id}`);
	} else if (hero1.isDead) {
		//console.log(`${hero2.heroStats.id} wins`);
		await hero1.heroDies();
		await hero2.heroKills();
		// await saveFight(i);
	} else if (hero2.isDead) {
		//console.log(`${hero1.heroStats.id} wins`);
		await hero1.heroKills();
		await hero2.heroDies();
		// await saveFight(i);
	}
};
