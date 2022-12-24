import { AnyHero } from '.';
import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Soldier extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	//Propiedades.
	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	//Head Shot
	skillProb: number = 0.23;
	skillDuration: number = 0;
	//Tortoise Form
	skill: any = () => {
		this.heroEfects.def = 18;
		this.skillDuration = 3;

		//stats
		this.fightStats.addSkillUses();
	};
	skillOff: any = () => (this.heroEfects.def = 0);

	end: () => void = () => {
		//skill defender
		if (this.skillDuration === 0 && this.skillProb > this.getProb()) {
			this.skill();
		} else {
			this.skillDuration = this.skillDuration - 1 > 0 ? this.skillDuration - 1 : 0;
			if (this.skillDuration === 0) {
				this.skillOff();
			}
		}
		// return this.isDead;
	};

	defend: (enemi: AnyHero) => any = async (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let { def: defEffect } = this.heroEfects;
		let finalDamage = 0;

		if (evasion <= this.getProb()) {
			//Evade o no.
			let enemiAttack = enemi.attack();
			let attMultiplier = 40 / (40 + def + defEffect);
			finalDamage = Math.round(enemiAttack * attMultiplier);
			
			//Stats
			enemi.fightStats.set('total_damage', enemi.fightStats.get('total_damage') + finalDamage);
			this.fightStats.addHitReceived();
		} else {
			enemi.calcNextTurn(enemi.heroEfects.att_interval);
			//stats
			this.fightStats.addEvasion();
		}

		this.heroStats.currentHp = currentHp - finalDamage > 0 ? currentHp - finalDamage : 0; //
		//stats
		this.fightStats.set('currhp', this.heroStats.currentHp);
		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
		}
	};
}
