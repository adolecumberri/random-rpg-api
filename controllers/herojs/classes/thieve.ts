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
		let damage = super.attack(this.heroEfects.dmg);

		this.calcNextTurn(this.heroEfects.att_interval);
		return damage;
	};

	defend: (enemi: AnyHero) => any = (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let { def: defEffect } = this.heroEfects;
		let finalDamage = 0;

		if(evasion <= this.getProb()) {
			//Evade o no.
			finalDamage = Math.floor((enemi.attack() * (100 - (def + defEffect) * 0.9)) / 100 - (def + defEffect) * 0.29);
		} else {
			console.log(`${id}.${name} ${surname} Evaded the attack`);
		}

		this.heroStats.currentHp = currentHp - finalDamage > 0 ? currentHp - finalDamage : 0; //

		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
			this.heroDies();
			enemi.heroKills();
			console.log(`${id}.${name} ${surname} has died`);
		} else {
			if (this.skillUsed) {
				// console.log(this.heroStats.name + " used RAGE");
				this.skillOf();
				this.skillUsed = false;
			} else {
				this.skill();
			}

			console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp}`);
		}
	};
}
