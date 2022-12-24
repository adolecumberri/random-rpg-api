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
		//stats
		this.fightStats.addSkillUses();

		this.heroEfects = {
			dmg: Math.floor(this.heroStats.dmg * 0.3),
			def: Math.floor(this.heroStats.def * 0.3),
			att_interval: -Math.floor(this.heroStats.att_interval * 0.3),
		};
	};
	skillOff: () => void = () => {
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
				//stats
				this.fightStats.addCrit();
				//critico
				damage = this.rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15);
				//console.log(`${id}.${name} ${surname}: ${damage}dmg!`);
			} else {
				//stats
				this.fightStats.addHit();
				damage = this.rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15);
				//console.log(`${id}.${name} ${surname}: ${damage}dmg`);
			}
		} else {
			this.fightStats.addMiss();
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
		} else {
			if (this.skillUsed) {
				this.skillOff();
				this.skillUsed = false;
			} else {
				this.skill();
			}
			//console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp}`);
		}
	};
}
