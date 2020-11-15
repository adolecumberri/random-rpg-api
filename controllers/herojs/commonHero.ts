/** NOTA.
 * Cuando un hijo quiere llamar a una funcion del padre, se la usa con this.F().
 * Cuando sobre escribo, pongo el mismo nombre y el hijo prioriza al padre. Aun así
 * si escribo super.func() se llama a func del padre. si pongo solo func() se llama ç
 * a la del hijo. Como olvide esto estoy jodido
 */

import { connection } from '../../config/database';
import { IHero } from '../../interfaces/Hero.Interface';
import { AnyHero } from './classes';

export class Hero {
	constructor(data: IHero) {
		this.heroStats = { ...data, curr_att_interval: data.att_interval };
	}

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
				//critico
				damage = this.rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15);
				//console.log(`${id}.${name} ${surname}: ${damage}dmg!`);
			} else {
				damage = this.rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15);
				//console.log(`${id}.${name} ${surname}: ${damage}dmg`);
			}
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
			// console.log(`${enemi.heroStats.id} does ${enemiAttack}dmg`);
			finalDamage = Math.floor((enemiAttack * (100 - def * 0.9)) / 100 - def * 0.29);

			// console.log(`${this.heroStats.id} received ${finalDamage}dmg`);
		} else {
			// console.log(`${enemi.heroStats.id} --- ${enemi.heroStats.curr_att_interval}`);
			enemi.calcNextTurn(enemi.heroEfects.att_interval);
			// console.log(`${enemi.heroStats.id} --- ${enemi.heroStats.curr_att_interval}`);
			// console.log(`${id}.${name} ${surname} Evaded the attack 4`);
		}

		this.heroStats.currentHp = currentHp - finalDamage >= 0 ? currentHp - finalDamage : 0; //
		// console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp} 7`);
		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
			await this.heroDies();
			await enemi.heroKills();
			// console.log(`${id}.${name} ${surname} has died 3`);
		}
	};

	//does hero dies after straightDamage?
	straightDamage: (damage: number) => Promise<boolean> = async (damage) => {
		let { id, hp, name, surname } = this.heroStats;
		this.heroStats.currentHp = this.heroStats.currentHp - damage >= 0 ? this.heroStats.currentHp - damage : 0;

		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
			// console.log(`${id}.${name} ${surname} has died 2`);

			await this.heroDies();
			return true;
		} else {
			// console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp} 1`);
			return false;
		}
	};

	//HERO DIES
	heroDies: () => Promise<unknown> = async () => {
		// console.log('entro en muerte');
		connection.query(`UPDATE hero SET deaths = deaths + 1 WHERE id = ${this.heroStats.id}`);
	};

	//HERO WINS
	heroKills: () => Promise<unknown> = async () => {
		// console.log('entro en victoria');
		connection.query(`UPDATE hero SET kills = kills + 1 WHERE id = ${this.heroStats.id}`);
	};

	//calculo siguiente turno. Habilidades de velocidad lo sobreescribiran.
	calcNextTurn2: (att_intervarEf?: number) => void = (att_intervarEf = 0) => {
		this.heroStats.curr_att_interval =
			(this.heroStats.curr_att_interval as number) + (this.heroStats.att_interval + att_intervarEf);
	};

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
