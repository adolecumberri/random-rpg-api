import { connection } from '../config/database';
import {
	Archer,
	Berserker,
	Defender,
	Fencer,
	Ninja,
	Paladin,
	Sniper,
	Soldier,
	Thieve,
} from '../controllers/herojs/classes';
import { IBeginFight, IFightStats, ITurnSingleFight } from '../interfaces/Figth.interface';

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

const saveSingleFight: any = async (fightStats: IFightStats, hero1: any, hero2: any) => {
	let { winner, loser, totalDmg1, totalDmg2, numHits1, numHits2, totalDmgStopped1, totalDmgStopped2 } = fightStats;

	let sqlMovidas = `INSERT INTO battle_information 
        VALUES (${hero1.heroStats.id}, ${hero2.heroStats.id}, ${winner}, ${loser}, ${
		hero1.heroStats.id_class
	}, ${Math.floor(totalDmg1)}, ${Math.floor(totalDmgStopped1)}, ${numHits1},${hero2.heroStats.id_class}, ${Math.floor(
		totalDmg2
	)}, ${Math.floor(totalDmgStopped2)}, ${numHits2}, null) ;`;

	connection.query(sqlMovidas);
};

const beginning: IBeginFight = (attacante, defensor, flag1, flag2) => {
	let {
		heroStats: { currentHp: curHpA, id: idA }, //Class
		setHp: setHpA,
		skill: skillA,
		end: endA,
	} = attacante;

	let {
		isHitted: isHittedD,
		heroStats: { currentHp: curHpD, id: idD },
		setHp: setHpD,
		end: endD,
	} = defensor;

	//RETURN DE LAS ESTADISTICAS.
	let totalDmgA: number = 0;
	let totalDmgD: number = 0;
	let totalDmgStopped: number = 0;
	let numHits: number = 0;

	//if (idA == 7) {
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
	return { totalDmgA, totalDmgD, totalDmgStopped, numHits, flag1, flag2 };
	//}
};

const turnSingleFight: ITurnSingleFight = (attacante, defensor, flag1, flag2) => {
	//ATTRIBUTOS DE LOS HEROES
	let {
		heroStats: { currentHp: curHpA, id: idA },
		setHp: setHpA,
		hit: hitA,
		skill: skillA,
		calcNextTurn: calcNextTurnA,
		end: endA,
	} = attacante;

	let {
		isHitted: isHittedD,
		heroStats: { currentHp: curHpD, id: idD },
		setHp: setHpD,
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
        flag1,
        flag2
	};
};

export { switchClass, saveSingleFight, beginning, turnSingleFight };
