import { AnyHero } from '.';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Berserker extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	//Propiedades.
	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	//RAGE
	skillProb = 1;
	skill: () => void = () => {
		this.heroEfects = { dmg: +22, def: -16, att_interval: -4 };
	};
	skillUsed = false;

	//HIT
	attack: () => number = () => {
		let damage = super.attack(this.heroEfects.dmg);

		return damage;
	};

	defend: (enemi: AnyHero) => any = (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let { def: defEffect } = this.heroEfects;
		let finalDamage = 0;

		if (evasion >= this.getProb()) {
			//Evade o no.
			finalDamage = Math.floor((enemi.attack() * (100 - (def + defEffect) * 0.9)) / 100 - (def + defEffect) * 0.29);
		} else {
			console.log(`${id}.${name} ${surname} Evaded the attack`);
		}

		this.heroStats.currentHp = currentHp - finalDamage > 0 ? currentHp - finalDamage : 0; //

		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
			this.heroDies();
			console.log(`${id}.${name} ${surname} has died`);
		} else {
			if (this.heroStats.currentHp <= hp * 0.3 && !this.skillUsed) {
				// console.log(this.heroStats.name + " used RAGE");
				this.skill();
				this.skillUsed = true;
			}

			console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp}`);
		}
	};

}
