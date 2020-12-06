import { AnyHero } from '.';
import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Paladin extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	//Propiedades.
	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	//BLESSING -- se usa fuera
	skillProb: number = 0.23;
	skill: () => void = () => {
		//stats
		this.fightStats.addSkillUses();

		this.heroStats.currentHp = this.rand(this.heroStats.hp * 0.3, this.heroStats.hp * 0.4);
	};
	skillUsed = false;

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

	end: () => void = () => {
		if (this.heroStats.currentHp < this.heroStats.hp * 0.6 && this.skillProb > this.getProb()) {
			this.skill();
		}
	};
}
