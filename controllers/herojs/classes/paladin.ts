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
		// //console.log(`${this.heroStats.name} was Blessed`);
		this.heroStats.currentHp = this.rand(this.heroStats.hp * 0.3, this.heroStats.hp * 0.4);
	};
	skillUsed = false;

	defend: (enemi: AnyHero) => any = async (enemi) => {
		let { id, hp, currentHp, name, surname, def, evasion } = this.heroStats;
		let finalDamage = 0;

		if (evasion <= this.getProb()) {
			//Evade o no.
			let enemiAttack = enemi.attack();
			finalDamage = Math.floor((enemiAttack * (100 - def * 0.9)) / 100 - def * 0.29);
		} else {
			enemi.calcNextTurn(enemi.heroEfects.att_interval);
		}

		this.heroStats.currentHp = currentHp - finalDamage >= 0 ? currentHp - finalDamage : 0; //
		this.end();
		
		if (this.heroStats.currentHp === 0) {
			this.isDead = true;
			await this.heroDies();
			await enemi.heroKills();
		}
		
	};

	end: () => void = () => {
		console.log("me curo");
		if (this.heroStats.currentHp < this.heroStats.hp * 0.6 && this.skillProb > this.getProb()) {
			this.skill();
		}
	};
}
