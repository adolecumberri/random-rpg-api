/** NOTA.
 * Cuando un hijo quiere llamar a una funcion del padre, se la usa con this.F().
 * Cuando sobre escribo, pongo el mismo nombre y el hijo prioriza al padre. Aun así
 * si escribo super.func() se llama a func del padre. si pongo solo func() se llama ç
 * a la del hijo. Como olvide esto estoy jodido
 */

import { connection } from '../../config/database';
import { IHero } from '../../interfaces/Hero.Interface';

export class Hero {
	constructor(data: IHero) {
		this.heroStats = { ...data, curr_att_interval: data.att_interval };
	}

	heroStats: IHero;
	isDead = false;

	beginning: () => void = () => {};

	start: () => void = () => {};

	end: () => void = () => {};

	attack: () => void = () => {
		let { id, name, surname, accuracy, crit, critDmg, dmg } = this.heroStats;
		let damage = 0;

		if (accuracy > this.getProb()) {
			//golpeo?
			if (crit > this.getProb()) {
				//critico
				damage = this.rand(dmg * (critDmg + 1) * 0.85, dmg * (critDmg + 1) * 1.15);
				console.log(`${id}.${name} ${surname}: ${damage}dmg!`);
			}else{
				damage = this.rand(dmg * 0.85, dmg  * 1.15);
				console.log(`${id}.${name} ${surname}: ${damage}dmg`);
			}
		}

		return damage;
	};

	defend: (damage: number) => any = (damage) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let finalDamage = 0;

		if (evasion >= this.getProb()) {
			//Evade o no.
			finalDamage = Math.floor((damage * (100 - def * 0.9)) / 100 - def * 0.29);
		} else {
			console.log(`${id}.${name} ${surname} Evaded the attack`);
		}

		this.heroStats.currentHp = currentHp - finalDamage > 0 ? currentHp - finalDamage : 0; //

		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
			this.heroDies();
			console.log(`${id}.${name} ${surname} has died`);
		} else {
			console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp}`);
		}
	};

	//HERO DIES
	heroDies: () => Promise<unknown> = async () =>
		new Promise((res, rej) => {
			connection.query(`UPDATE hero SET deaths = deaths + 1 WHERE id = ${this.heroStats.id}`);
		});

	//HERO WINS
	heroKills: () => Promise<unknown> = async () =>
		new Promise((res, rej) => {
			connection.query(`UPDATE hero SET kills = kills + 1 WHERE id = ${this.heroStats.id}`);
		});

	//calculo siguiente turno. Habilidades de velocidad lo sobreescribiran.
	calcNextTurn = () => {
		this.heroStats.curr_att_interval = (this.heroStats.curr_att_interval as number) + this.heroStats.att_interval;
	};

	//function to generate rand numbers
	rand: (min: number, max: number) => number = (min: number, max: number) =>
		Math.round(Math.random() * (max - min) + min);

	//function to load probabilities.
	getProb: () => number = () => Math.random();
}
