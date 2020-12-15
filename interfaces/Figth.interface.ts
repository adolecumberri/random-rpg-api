import { Archer, Berserker, Defender, Fencer, Ninja, Paladin, Sniper, Soldier } from '../controllers/herojs/classes';

export interface IFightStats {
	totalDmg1: number;
	totalDmg2: number;
	totalDmgStopped1: number;
	totalDmgStopped2: number;
	numHits1: number;
	numHits2: number;
	winner: number | null;
	loser: number | null;
}

export type IBeginFight = (
	hero1: Archer | Berserker | Defender | Fencer | Ninja | Paladin | Sniper | Soldier,
	hero2: Archer | Berserker | Defender | Fencer | Ninja | Paladin | Sniper | Soldier,
	flag1: boolean,
	flag2: boolean
) => {
	totalDmgA: number;
	totalDmgD: number;
	totalDmgStopped: number;
	numHits: number;
	flag1: boolean;
	flag2: boolean;
};

export type ITurnSingleFight = (
	attacante: Archer | Berserker | Defender | Fencer | Ninja | Paladin | Sniper | Soldier,
	defensor: Archer | Berserker | Defender | Fencer | Ninja | Paladin | Sniper | Soldier,
	flag1: boolean,
	flag2: boolean
) =>  {
	totalDmgA: number,
	totalDmgD: number,
	totalDmgStopped: number,
	numHits: number,
	flag1: boolean,
	flag2: boolean
};

export interface IGroupFightSolution {
	
}

//(attacante: any, defensor: any, flag1, flag2)
/*
	return {
		totalDmgA,
		totalDmgD,
		totalDmgStopped,
		numHits,
	};

*/
