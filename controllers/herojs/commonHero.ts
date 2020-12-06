/** NOTA.
 * Cuando un hijo quiere llamar a una funcion del padre, se la usa con this.F().
 * Cuando sobre escribo, pongo el mismo nombre y el hijo prioriza al padre. Aun así
 * si escribo super.func() se llama a func del padre. si pongo solo func() se llama ç
 * a la del hijo. Como olvide esto estoy jodido
 */

import { connection } from '../../config/database';
import { IFightStats } from '../../interfaces/Figth.interface';
import { IHero } from '../../interfaces/Hero.Interface';
import { AnyHero } from './classes';
import { StatsManager } from './fightStatsManager';

export class Hero {
	constructor(data: IHero) {
		this.heroStats = { ...data, curr_att_interval: data.att_interval };
		this.fightStats = new StatsManager(data.id);
	}
	// fightStats: IFightStats
	fightStats: StatsManager; //Manager de stats. Easy
	heroStats: IHero;
	isDead = false;

	start: () => void = () => {};

	end: () => void = () => {};

	attack: (dmgEf?: number) => number = (dmgEf = 0) => {
		let { id, name, surname, accuracy, crit, critDmg, dmg } = this.heroStats;
		let damage = 0;

		if (accuracy > this.getProb()) {
			//golpeo?
			if (crit > this.getProb()) {
				this.fightStats.addCrit();
				//critico
				damage = this.rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15);
			} else {
				this.fightStats.addHit();
				damage = this.rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15);
			}
		} else {
			this.fightStats.addMiss();
		}
		this.calcNextTurn();
		return damage;
	};

	defend: (enemi: AnyHero) => any = async (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let finalDamage = 0;

		if (evasion <= this.getProb()) {
			//Evade o no.
			let enemiAttack = enemi.attack();
			let attMultiplier = 40 / (40 + def);
			finalDamage = Math.round(enemiAttack * attMultiplier);

			//Stats
			enemi.fightStats.set('total_damage', enemi.fightStats.get('total_damage') + finalDamage);
			this.fightStats.addHitReceived();
		} else {
			enemi.calcNextTurn(enemi.heroEfects.att_interval);

			//stats
			this.fightStats.addEvasion();
		}

		this.heroStats.currentHp = currentHp - finalDamage >= 0 ? currentHp - finalDamage : 0; //
		//stats
		this.fightStats.set('currhp', this.heroStats.currentHp);
		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
		}
	};

	//does hero dies after straightDamage?
	straightDamage: (damage: number) => void = (damage) => {
		let { id, hp, name, surname } = this.heroStats;
		this.heroStats.currentHp = this.heroStats.currentHp - damage >= 0 ? this.heroStats.currentHp - damage : 0;

		//stats
		this.fightStats.addHitReceived();
		this.fightStats.set('currhp', this.heroStats.currentHp);
		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
		}
	};

	//HERO DIES
	heroDies: () => Promise<unknown> = async () => {
		// console.log('entro en muerte');
		// if (this.heroStats.id_class === 2) {
		// 	console.log('Berserk dies');
		// } else {
		// 	console.log('Archer dies');
		// }
		await new Promise((resolve, reject) => {
			connection.query(`UPDATE hero SET deaths = deaths + 1 WHERE id = ${this.heroStats.id}`, (err, result) =>
				resolve(true)
			);
		});
	};

	//HERO WINS
	heroKills: () => Promise<unknown> = async () => {
		// if (this.heroStats.id_class === 2) {
		// 	console.log('Berserk kills');
		// } else {
		// 	console.log('Archer kills');
		// }
		// console.log('entro en victoria');
		await new Promise((resolve, reject) => {
			connection.query(`UPDATE hero SET kills = kills + 1 WHERE id = ${this.heroStats.id}`, (err, result) =>
				resolve(true)
			);
		});
	};

	//calculo siguiente turno. Habilidades de velocidad lo sobreescribiran.
	calcNextTurn: (att_intervalEf?: number) => void = (att_intervalEf = 0) => {
		let { curr_att_interval, att_interval } = this.heroStats;
		let new_att_interval = (curr_att_interval as number) + (att_interval + att_intervalEf);
		this.heroStats.curr_att_interval =
			new_att_interval > Number(this.heroStats.curr_att_interval) ? new_att_interval : Number(curr_att_interval) + 1;
	};

	//function to generate rand numbers
	rand: (min: number, max: number) => number = (min: number, max: number) =>
		Math.round(Math.random() * (max - min) + min);

	//function to load probabilities.
	getProb: () => number = () => Math.random();
}
