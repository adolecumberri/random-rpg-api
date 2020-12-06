import { AnyHero } from '.';
import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Fencer extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	//Propiedades.
	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	//Counter
	skillProb: number = 0.22;
	skill: any = (damage: number) => {
		this.fightStats.addSkillUses();
		return this.rand(damage * 0.85, damage * 1.15);
	}; //Sutil nerfeo aquí.
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

		//contrataco. si fallo, recibo el daño.
		if (this.skillProb > this.getProb()) {
			this.fightStats.addHit();
			enemi.straightDamage(this.skill(finalDamage));
		} else {
			this.heroStats.currentHp = currentHp - finalDamage > 0 ? currentHp - finalDamage : 0; //
			//stats
			this.fightStats.set('currhp', this.heroStats.currentHp);
			if (this.heroStats.currentHp === 0) {
				this.isDead = true;
			}
		}
	};
}
