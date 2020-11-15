import { AnyHero } from '.';
import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Thieve extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	//Propiedades.
	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	//COURAGE
	skillProb: number = 0.6;
	skill: () => void = () => {
		this.heroEfects = {
			dmg: this.heroStats.dmg * 0.3,
			def: this.heroStats.def * 0.3,
			att_interval: -(this.heroStats.att_interval * 0.3),
		};
	};
	skillOf: () => void = () => {
		this.heroEfects = {
			dmg: 0,
			def: 0,
			att_interval: 0,
		};
	};
	skillUsed = false;

	attack: () => number = () => {
		let { id, name, surname, accuracy, crit, critDmg, dmg } = this.heroStats;
		let { dmg: dmgEf, att_interval } = this.heroEfects;
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

		this.calcNextTurn(att_interval);
		return damage;
	};

	defend: (enemi: AnyHero) => any = async (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let { def: defEffect } = this.heroEfects;
		let finalDamage = 0;

		if (evasion <= this.getProb()) {
			//Evade o no.
			finalDamage = Math.floor((enemi.attack() * (100 - (def + defEffect) * 0.9)) / 100 - (def + defEffect) * 0.29);
		} else {
			enemi.calcNextTurn(enemi.heroEfects.att_interval);
			//console.log(`${id}.${name} ${surname} Evaded the attack`);
		}
		this.heroStats.currentHp = currentHp - finalDamage > 0 ? currentHp - finalDamage : 0; //

		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
		
			//console.log(`${id}.${name} ${surname} has died`);
			await this.heroDies();
			await enemi.heroKills();
			 //No tiene sentido pero he puesto esto
		} else {
			if (this.skillUsed) {
				this.skillOf();
				this.skillUsed = false;
			} else {
				this.skill();
			}
			//console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp}`);
		}

		return 0;
	};
}
