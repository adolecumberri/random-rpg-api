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
		//stats
		this.fightStats.addSkillUses();
		this.heroEfects = { dmg: +22, def: -16, att_interval: -4 };
	};
	skillUsed = false;

	attack: () => number = () => {
		let { id, name, surname, accuracy, crit, critDmg, dmg } = this.heroStats;
		let { dmg: dmgEf } = this.heroEfects;
		let damage = 0;

		if (accuracy > this.getProb()) {
			//golpeo?
			if (crit > this.getProb()) {
				//critico
				damage = this.rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15);
				//stats
				this.fightStats.addCrit();
			} else {
				//stats
				this.fightStats.addHit();
				damage = this.rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15);
			}
		} else {
			this.fightStats.addMiss();
		}

		this.calcNextTurn(this.heroEfects.att_interval);
		return damage;
	};

	defend: (enemi: AnyHero) => any = async (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let { def: defEffect } = this.heroEfects;
		let finalDamage = 0;

		if (evasion <= this.getProb()) {
			//Evade o no.
			let enemiAttack = enemi.attack();
			let attMultiplier = 40 /( 40 + def + defEffect);
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
		} else {
			if (this.heroStats.currentHp <= hp * 0.3 && !this.skillUsed) {
				this.skill();
				this.skillUsed = true;
			}
		}
	};
}
