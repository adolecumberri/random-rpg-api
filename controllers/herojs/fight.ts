import { connection } from '../../config/database';
import { HeroGroup } from '../groupjs/group';
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
		await saveFight(i);
	} else if (hero2.isDead) {
		//console.log(`${hero1.heroStats.id} wins`);
		await hero1.heroKills();
		await hero2.heroDies();
		await saveFight(i);
	}
};

export const teamFight: (groupA: HeroGroup, groupB: HeroGroup, eventId?: number) => Promise<number> = async (
	groupA,
	groupB,
	eventId = 0 //unused
) => {
	let id_fight = 0;

	await (async () => {
		let prueba = 'prueba';
		await new Promise((resolve, reject) => {
			connection.query(`insert into groupfight set name = "${prueba}";`, async (err, result) => {
				// console.log(result);
				id_fight = result.insertId as number;
				resolve(true);
			});
		});
	})();

	//snioper Skills
	let snipersA = groupA.getHerosByClass(7);
	if (snipersA.length) {
		let hittedB = groupB.getRandomGroup(snipersA.length);
		snipersA.forEach(async (sniper, i) => {
			hittedB[i].defend(sniper);
			hittedB[i].end();
			if (hittedB[i].heroStats.currentHp <= 0) {
				groupB.heroDeath(hittedB[i].heroStats.id, 0, sniper.heroStats.id);
			}
		});
	}

	let snipersB = groupB.getHerosByClass(7);

	if (snipersB.length) {
		let hittedA = groupA.getRandomGroup(snipersB.length);
		snipersB.forEach(async (sniper, i) => {
			hittedA[i].defend(sniper);
			hittedA[i].end();
			if (hittedA[i].heroStats.currentHp <= 0) {
				groupA.heroDeath(hittedA[i].heroStats.id, 0, sniper.heroStats.id);
			}
		});
	}

	let i = 1;
	let turnUntil = 100;
	let turn: () => Promise<void> = async () => {
		for (; i < turnUntil && !flagA && !flagB; i++) {
			//atacantes A
			let attackersA = groupA.getHerosByAtt_interval(i);

			if (attackersA.length) {
				//defensores B

				//hay defensores? ergo, queda gente viva?
				if (groupB.heros.length) {
					//TODO: think about: while creating promises, you can check multiple times the same hero and kill him several times.
					await Promise.all(
						attackersA.map(async (att, i) => {
							console.log(att.heroStats.id + ' attacks');

							let hittedB = groupB.getRandomHero();

							if (hittedB !== undefined) {
								await hittedB.defend(att);

								if (hittedB.heroStats.currentHp <= 0) {
									groupB.heroDeath(hittedB.heroStats.id, i, att.heroStats.id);
								}
							}
						})
					);
				} else {
					flagB = true;
				}
			}

			//atacantes B
			let attackersB = groupB.getHerosByAtt_interval(i);

			if (attackersB.length) {
				//defensores A
				if (groupA.heros.length) {
					await Promise.all(
						attackersB.map(async (att, i) => {
							console.log(att.heroStats.id + ' attacks');

							let hittedA = groupA.getRandomHero();

							if (hittedA !== undefined) {
								await hittedA.defend(att);

								if (hittedA.heroStats.currentHp <= 0) {
									groupA.heroDeath(hittedA.heroStats.id, i, att.heroStats.id);
								}
							}
						})
					);
				} else {
					flagA = true;
				}
			}
		}
	};

	// turn
	let flagA = false;
	let flagB = false;
	let drawProb = 0.05;
	let fightDrawed = false;
	let turns = 1;
	do {
		await turn();
		turnUntil += 100;
		fightDrawed = drawProb > Math.random();
		turns++;
	} while (!fightDrawed && !flagA && !flagB);

	console.log({ turns });

	await new Promise((resolve, reject) => {
		connection.query(
			`update groupfight set ${
				fightDrawed ? ` drawed = 1, turns = ${turns} ` : ` turns = ${turns} `
			} where id = ${id_fight};`,
			async (err, result) => {
				// console.log(result);
				id_fight = result.insertId as number;
				resolve(true);
			}
		);
	});

	if (groupA.heros.length) {
		console.log('entro A');
		await groupA.saveHeros(id_fight, i);

		await groupA.saveHerosUpdate();
	}
	if (groupA.deaths.length) {
		console.log('entro A2');
		await groupA.saveDeaths(id_fight, i);

		await groupA.updateDeaths();
	}

	if (groupB.heros.length) {
		console.log('entro B');
		await groupB.saveHeros(id_fight, i);
		await groupB.saveHerosUpdate();
	}
	if (groupB.deaths.length) {
		console.log('entro B2');
		await groupB.saveDeaths(id_fight, i);
		await groupA.updateDeaths();
	}

	/*
	-1: error ?
	1: groupA wins
	2: groupB wins
	3: draw -stopped before end
	4: both death.
	*/
	let result = -1;
	if (!groupA.heros.length && !groupB.heros.length) {
		result = 4;
	} else if (!groupA.heros.length) {
		result = 2;
	} else if (!groupB.heros.length) {
		result = 1;
	} else if (groupA.heros.length && groupA.heros.length) {
		result = 3;
	}
	console.log(`fight result ${result}`);
	return result;

	//TODO: final de la pelea
};
