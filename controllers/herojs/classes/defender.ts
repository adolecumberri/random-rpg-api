import { AnyHero } from '.';
import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Defender extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	//THORNMAIL
	skillProb = 1;
	skill: (damage: number) => number = (damage) => {
		this.fightStats.addSkillUses();
		return Math.floor(7 + damage * 0.2);
	};
	skillUsed = false;

	//CALC DAMAGE AFTER BLOCKING
	defend: (enemi: AnyHero) => any = async (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let finalDamage = 0;

		if (evasion <= this.getProb()) {
			//Evade o no.
			let enemiAttack = enemi.attack();
			let attMultiplier = 40 / (40 + def);
			finalDamage = Math.round(enemiAttack * attMultiplier);

			//if he hits, I use the skill.
			let skillDmg = this.skill(finalDamage);
			enemi.straightDamage(skillDmg);

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
