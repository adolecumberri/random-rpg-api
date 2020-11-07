import { IFightStats } from '../interfaces/Figth.interface';
import { IHero } from '../interfaces/Hero.Interface';
import { connection } from '../config/database';

import { Express, Request, Response, NextFunction } from 'express';
import { getCrewByCrewId } from '../commonModules/crew';
import { switchClass, saveSingleFight, beginning, turnSingleFight } from '../commonModules/fight';

const fight = (heroA: IHero, heroB: IHero) => {
	let fightStats: IFightStats = {
		totalDmg1: 0,
		totalDmg2: 0,
		totalDmgStopped1: 0,
		totalDmgStopped2: 0,
		numHits1: 0,
		numHits2: 0,
		winner: null,
		loser: null,
	};

	//carga de la clase de cada heroe
	let hero1 = switchClass(heroA);
	let hero2 = switchClass(heroB);

	//Cargar intervalo
	let nextTurnHero1: number = hero1.heroStats.att_interval;
	let nextTurnHero2: number = hero2.heroStats.att_interval;

	//flags
	let flagH1: boolean = false;
	let flagH2: boolean = false;

	//SKILLS FROM SNIPERS.
	if (hero1.heroStats.id_class == 7) {
		let { totalDmgA, totalDmgD, totalDmgStopped, numHits, flag1, flag2 } = beginning(hero1, hero2, flagH1, flagH2);
		flagH1 = flag1;
		flagH2 = flag2;

		fightStats = {
			...fightStats,
			totalDmg1: totalDmgA,
			totalDmg2: totalDmgD,
			totalDmgStopped1: totalDmgStopped,
			numHits1: numHits,
		};
	}

	if (hero2.heroStats.id_class == 7) {
		let { totalDmgA, totalDmgD, totalDmgStopped, numHits, flag1, flag2 } = beginning(hero2, hero1, flagH2, flagH1);

		flagH1 = flag2;
		flagH2 = flag1;

		fightStats = {
			...fightStats,
			totalDmg2: totalDmgA,
			totalDmg1: totalDmgD,
			totalDmgStopped2: totalDmgStopped,
			numHits2: numHits,
		};
	}
	//END SKILLS FROM SNIPERS

	for (let i = 0; !flagH1 && !flagH2; i++) {
		//
		if (i == nextTurnHero1) {
			let { totalDmgA, totalDmgD, totalDmgStopped, numHits, flag1, flag2 } = turnSingleFight(
				hero1,
				hero2,
				flagH1,
				flagH2
			);

			flagH1 = flag1;
			flagH2 = flag2;

			fightStats = {
				...fightStats,
				totalDmg1: totalDmgA,
				totalDmg2: totalDmgD,
				totalDmgStopped1: totalDmgStopped,
				numHits1: numHits,
			};
			nextTurnHero1 = hero1.calcNextTurn(nextTurnHero1);
		}
		if (i == nextTurnHero2) {
			let { totalDmgA, totalDmgD, totalDmgStopped, numHits, flag1, flag2 } = turnSingleFight(
				hero2,
				hero1,
				flagH1,
				flagH2
			);

			flagH1 = flag2;
			flagH2 = flag1;

			fightStats = {
				...fightStats,
				totalDmg2: totalDmgA,
				totalDmg1: totalDmgD,
				totalDmgStopped2: totalDmgStopped,
				numHits2: numHits,
			};
			nextTurnHero2 = hero2.calcNextTurn(nextTurnHero2);
		}
	}

	//Final De La Pelea --- victoria y derrota
	if (flagH1 && flagH2) {
		//si se empata se les da otra oportunidad
	} else {
		if (flagH1) {
			hero2.heroWins(); //GANA HEROE 2
			hero1.heroDead();
			fightStats.loser = hero1.heroStats.id;
			fightStats.winner = hero2.heroStats.id;
		} else {
			if (flagH2) {
				hero1.heroWins(); //GANA HEROE 2
				hero2.heroDead();
				fightStats.loser = hero2.heroStats.id;
				fightStats.winner = hero1.heroStats.id;
			}
		}
	}
	//Guardar en la base de datos
	if (!flagH1 || !flagH2) {
		saveSingleFight(fightStats, hero1, hero2);
	}
};

export { fight };
