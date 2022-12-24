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
	| 'evasions'
	| 'skills_used'
	| 'currhp';

export class StatsManager {
	constructor(id_hero: number) {
		this.id_hero = id_hero;
	}

	private id_hero = 0;
	private hits = 0;
	private total_damage = 0;
	private crits = 0;
	private misses = 0;
	private hits_received = 0;
	private damageStopped = 0;
	private evasions = 0;
	private skills_used = 0;
	private currhp = 0;

	addHit = () => {
		this.hits++;
	};

	addCrit = () => {
		this.crits++;
		this.hits++;
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

	get = (name: TStatsManaget) => {
		return this[name];
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
		let param = `INSERT INTO  fight1v1stats SET 
					id_hero = ${this.id_hero},
					id_fight = ${id_fight},
					hits = ${this.hits},
					total_damage = ${this.total_damage},
					crits = ${this.crits},
					misses = ${this.misses},
					hits_received = ${this.hits_received},
					evasions = ${this.evasions},
					skills_used = ${this.skills_used},
					currhp = ${this.currhp}
					`;
		await new Promise((resolve, reject) => {
			connection.query(param, () => {
				resolve(true);
			});
		});
	};

	getParamsToInsert: () => string = () => {
		return ` ${this.hits}, ${this.total_damage}, ${this.crits}, ${this.misses}, ${this.hits_received}, ${this.evasions}, ${this.skills_used}, ${this.currhp}`;
	};
}
