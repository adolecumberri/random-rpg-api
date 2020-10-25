import { Archer } from './herojs/classes/archer';
import { Berserker } from './herojs/classes/berserker';
import { Defender } from './herojs/classes/defender';
import { Fencer } from './herojs/classes/fencer';
import { Ninja } from './herojs/classes/ninja';
import { Paladin } from './herojs/classes/paladin';
import { Sniper } from './herojs/classes/sniper';
import { Soldier } from './herojs/classes/soldier';
import { Thieve } from './herojs/classes/thieve';

import { IFightStats } from '../interfaces/Figth.interface';
import { IHeroFight } from '../interfaces/Hero.Interface';
import { connection } from '../config/database';

let flag1: boolean = false;
let flag2: boolean = false;

const fight = (heroA: IHeroFight, heroB: IHeroFight) => {
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

	//SKILLS FROM SNIPERS.
	if (hero1.heroStats.id_class == 7) {
		let { totalDmgA, totalDmgD, totalDmgStopped, numHits } = beginning(hero1, hero2);

		fightStats = {
			...fightStats,
			totalDmg1: totalDmgA,
			totalDmg2: totalDmgD,
			totalDmgStopped1: totalDmgStopped,
			numHits1: numHits,
		};
	}

	if (hero2.heroStats.id_class == 7) {
		let { totalDmgA, totalDmgD, totalDmgStopped, numHits } = beginning(hero2, hero1);
		fightStats = {
			...fightStats,
			totalDmg2: totalDmgA,
			totalDmg1: totalDmgD,
			totalDmgStopped2: totalDmgStopped,
			numHits2: numHits,
		};
	}
	//END SKILLS FROM SNIPERS

	for (let i = 0; !flag1 && !flag2; i++) {
		//
		if (i == nextTurnHero1) {
			let { totalDmgA, totalDmgD, totalDmgStopped, numHits } = turn(hero1, hero2);
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
			let { totalDmgA, totalDmgD, totalDmgStopped, numHits } = turn(hero2, hero1);
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
	if (flag1 && flag2) {
		//si se empata se les da otra oportunidad
	} else {
		if (flag1) {
			hero2.heroWins(); //GANA HEROE 2
			hero1.heroDead();
			fightStats.loser = hero1.heroStats.id;
			fightStats.winner = hero2.heroStats.id;
		} else {
			if (flag2) {
				hero1.heroWins(); //GANA HEROE 2
				hero2.heroDead();
				fightStats.loser = hero2.heroStats.id;
				fightStats.winner = hero1.heroStats.id;
			}
		}
	}
	//Guardar en la base de datos
	if (!flag1 || !flag2) {
		saveFight(fightStats, hero1, hero2);
	}
};

export { fight };

const saveFight: any = (fightStats: IFightStats, hero1: any, hero2: any) => {
	let { winner, loser, totalDmg1, totalDmg2, numHits1, numHits2, totalDmgStopped1, totalDmgStopped2 } = fightStats;

	let sqlMovidas = `INSERT INTO battle_information 
        VALUES (${hero1.heroStats.id}, ${hero2.heroStats.id}, ${winner}, ${loser}, ${
		hero1.heroStats.id_class
	}, ${Math.floor(totalDmg1)}, ${Math.floor(totalDmgStopped1)}, ${numHits1},${hero2.heroStats.id_class}, ${Math.floor(
		totalDmg2
	)}, ${Math.floor(totalDmgStopped2)}, ${numHits2}, null) ;`;

	connection.query(sqlMovidas);
};

const beginning: any = (attacante: any, defensor: any) => {
	let {
		heroStats: { currentHp: curHpA },
		setHp: setHpA,
		id: idA, //Class
		skill: skillA,
		end: endA,
	} = attacante;

	let {
		isHitted: isHittedD,
		heroStats: { currentHp: curHpD },
		setHp: setHpD,
		id: idD, // Class
		end: endD,
	} = defensor;

	//RETURN DE LAS ESTADISTICAS.
	let totalDmgA: number = 0;
	let totalDmgD: number = 0;
	let totalDmgStopped: number = 0;
	let numHits: number = 0;

	if (idA == 7) {
		let hit = skillA();
		let hitDeffended = isHittedD(hit.dmg); //actualizo el golpe. (damage) => { evaded, dmg }
		!hitDeffended.evaded //No ha sido evadido ? golpeo. sino nada
			? setHpD(curHpD - hitDeffended.dmg)
			: '';

		//Stats Basicas
		if (!hitDeffended.evaded && hit.type !== 'miss') {
			totalDmgA += hit.dmg; // --------- Stats
			totalDmgStopped += hit.dmg - hitDeffended.dmg; // --------- Stats
			numHits; // --------------Stats
		}

		//SKILL DEFENDER && SKILL FENCER
		if ((idD == 3 || idD == 4) && hitDeffended.skill !== undefined) {
			setHpA = setHpA(curHpA - hitDeffended.skill); //al pj 1 se hiere al atacar un Defencer
			totalDmgD += hitDeffended.skill; // ------------------Stats
			// console.log(`${name1} hitted by thornmail - ${hitDeffended.skill}`);
		}

		//Al final del turno
		flag1 = endA(curHpA);
		flag2 = endD(curHpD);

		//Re-set stats
		return { totalDmgA, totalDmgD, totalDmgStopped, numHits };
	}
};

let switchClass = (hero: any) => {
	let solution: Archer | Berserker | Defender | Fencer | Ninja | Paladin | Sniper | Soldier | undefined = undefined;
	switch (hero.id_class) {
		case 1:
			solution = new Archer(hero);
			break;
		case 2:
			solution = new Berserker(hero);
			break;
		case 3:
			solution = new Defender(hero);
			break;
		case 4:
			solution = new Fencer(hero);
			break;
		case 5:
			solution = new Ninja(hero);
			break;
		case 6:
			solution = new Paladin(hero);
			break;
		case 7:
			solution = new Sniper(hero);
			break;
		case 8:
			solution = new Soldier(hero);
			break;
		case 9:
			solution = new Thieve(hero);
			break;
	}

	return solution as Archer | Berserker | Defender | Fencer | Ninja | Paladin | Sniper | Soldier;
};

const turn: any = (attacante: any, defensor: any) => {
	//ATTRIBUTOS DE LOS HEROES
	let {
		heroStats: { currentHp: curHpA },
		setHp: setHpA,
		hit: hitA,
		id: idA,
		skill: skillA,
		calcNextTurn: calcNextTurnA,
		end: endA,
	} = attacante;

	let {
		isHitted: isHittedD,
		heroStats: { currentHp: curHpD },
		setHp: setHpD,
		id: idD,
		end: endD,
	} = defensor;

	//RETURN DE LAS ESTADISTICAS.
	let totalDmgA: number = 0;
	let totalDmgD: number = 0;
	let totalDmgStopped: number = 0;
	let numHits: number = 0;

	let hit = hitA(); //golpeo return {type, dmg }
	let hitDeffended = isHittedD(hit.dmg); //actualizo el golpe. (damage) => { evaded, dmg }

	!hitDeffended.evaded //No ha sido evadido ? golpeo. sino nada
		? setHpD(curHpD - hitDeffended.dmg)
		: '';

	//setting Stats Basicas
	if (!hitDeffended.evaded && hit.type !== 'miss') {
		totalDmgA += hit.dmg; // --------- Stats
		totalDmgStopped += hit.dmg - hitDeffended.dmg; // --------- Stats
		numHits; // --------------Stats
	}

	//SKILL DEFENDER
	if ((idD == 3 || idD == 4) && hitDeffended.skill !== undefined) {
		setHpA = setHpA(curHpA - hitDeffended.skill); //al pj 1 se hiere al atacar un Defencer
		// console.log(`${name1} hitted by thornmail - ${hitDeffended.skill}`);
		totalDmgD += hitDeffended.skill; // ------------------Stats
	}

	//SKILL PALADIN
	if (idA == 6) {
		curHpA = skillA(curHpA);
	}

	//Al final del turno
	flag1 = endA(curHpA);
	flag2 = endD(curHpD);

	return {
		totalDmgA,
		totalDmgD,
		totalDmgStopped,
		numHits,
	};
};
