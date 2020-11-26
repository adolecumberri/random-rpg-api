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
	skill: (damage: number) => number = (damage) => Math.floor(7 + damage * 0.2);
	skillUsed = false;

	//CALC DAMAGE AFTER BLOCKING
	defend: (enemi: AnyHero) => any = async (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let finalDamage = 0;

		if (evasion <= this.getProb()) {
			//Evade o no.
			let enemiAttack = enemi.attack();

			finalDamage = Math.floor((enemiAttack * (100 - def * 0.9)) / 100 - def * 0.29);

			let enemiDeath = false;

			//if he hits, I use the skill.
			let skillDmg = this.skill(finalDamage);
			//console.log(`${id}.${name} ${surname}: skill dmg = ${skillDmg}`);
			enemiDeath = await enemi.straightDamage(skillDmg);

			// if (enemiDeath) {
			// 	await this.heroKills();
			// }
		} else {
			enemi.calcNextTurn(enemi.heroEfects.att_interval);
			//console.log(`${id}.${name} ${surname} Evaded the attack`);
		}

		this.heroStats.currentHp = currentHp - finalDamage > 0 ? currentHp - finalDamage : 0; //

		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
			// await this.heroDies();
			// await enemi.heroKills();
			//console.log(`${id}.${name} ${surname} has died`);
		} else {
			//console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp}`);
		}
	};
}
