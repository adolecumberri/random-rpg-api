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
	skill: (damage: number) => number = (damage) => Math.floor(6 + damage * 0.2);
	skillUsed = false;

	//CALC DAMAGE AFTER BLOCKING
	defend: (enemi: AnyHero) => any = (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let finalDamage = 0;

		if(evasion <= this.getProb()) {
			//Evade o no.
			finalDamage = Math.floor((enemi.attack() * (100 - def * 0.9)) / 100 - def * 0.29);
			//if he hits, I use the skill.
			let enemiDeath = enemi.straightDamage(this.skill(finalDamage));
			if(enemiDeath){
				this.heroKills();
			}
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
			console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp}`);
		}
	};
}
