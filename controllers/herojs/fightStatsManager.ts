// id_hero int
// id_fight int
// hits int
// total_damage int
// crits int
// misses int
// hits_received int
// damageStopped int
// evasions int
// skills_used int
// currhp

import { idText } from 'typescript';
import { connection } from '../../config/database';
import { IHero } from '../../interfaces/Hero.Interface';

type TStatsManaget =
	| 'hits'
	| 'total_damage'
	| 'crits'
	| 'misses'
	| 'hits_received'
	| 'damageStopped'
	| 'evasions'
    | 'skills_used'
    | 'currhp';
    
export class StatsManager {
	constructor(id_hero: number) {
		this.id_hero = id_hero;
	}

	id_hero = 0;
	hits = 0;
	total_damage = 0;
	crits = 0;
	misses = 0;
	hits_received = 0;
	damageStopped = 0;
	evasions = 0;
	skills_used = 0;
	currhp = 0;

	addHit = () => {
		this.hits++;
	};

	addCrit = () => {
		this.crits++;
	};

	addMiss = () => {
		this.misses++;
	};

	addHitReceived = () => {
		this.hits_received++;
	};

	addEvasion = () => {
		this.evasions++;
	};

	addSkillUses = () => {
		this.skills_used++;
	};

	set = (name: TStatsManaget, value: number) => {
		this[name] = value;
	};

	// saveStats: (id_fight: number) => Promise<unknown> = async (id_fight) => {
	// 	await new Promise((resolve, reject) => {
	// 		connection.query(
	// 			`INSERT INTO  fight1v1stats VALUES (${this.id_hero}, ${id_fight}, ${this.hits}, ${this.total_damage}, ${this.crits}, ${this.misses}, ${this.hits_received}, ${this.damageStopped}, ${this.evasions}, ${this.skills_used}, ${this.currhp});`,
	// 			(err, result) => resolve(true)
	// 		);
	// 	});
	// };

	saveStats: (id_fight: number) => Promise<unknown> = async (id_fight) => {
		await new Promise((resolve, reject) => {
			connection.query(
				'INSERT INTO  fight1v1stats VALUES ?',
				[
					this.id_hero,
					id_fight,
					this.hits,
					this.total_damage,
					this.crits,
					this.misses,
					this.hits_received,
					this.damageStopped,
					this.evasions,
					this.skills_used,
					this.currhp,
				],
				(err, result) => resolve(true)
			);
		});
	};
}
