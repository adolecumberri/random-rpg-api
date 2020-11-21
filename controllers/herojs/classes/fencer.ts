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
		return this.rand(damage * 0.85, damage * 1.15);
	}; //Sutil nerfeo aquí.
	skillUsed = false;

	defend: (enemi: AnyHero) => any = async (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let finalDamage = 0;

		if (evasion <= this.getProb()) {
			//Evade o no.
			finalDamage = Math.floor((enemi.attack() * (100 - def * 0.9)) / 100 - def * 0.29);
		} else {
			enemi.calcNextTurn(enemi.heroEfects.att_interval);
			//console.log(`${id}.${name} ${surname} Evaded the attack`);
		}

		//contrataco. si fallo, recibo el daño.
		if (this.skillProb > this.getProb()) {
			let enemiDeath = await enemi.straightDamage(this.skill(finalDamage));
			if (enemiDeath) {
				this.heroKills();
			}
		} else {
			this.heroStats.currentHp = currentHp - finalDamage > 0 ? currentHp - finalDamage : 0; //ç
			if (this.heroStats.currentHp === 0) {
				this.isDead = true;
				await this.heroDies();
				await enemi.heroKills();
				//console.log(`${id}.${name} ${surname} has died`);
			} else {
				//console.log(`${id}.${name} ${surname}: ${this.heroStats.currentHp}/${hp}`);
			}
		}
	};
}
