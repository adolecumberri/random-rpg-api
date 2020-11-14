import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Archer extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	//Propiedades.
	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	//Haste
	skillProb = 0.33;
	skill: () => void = () => {
		this.heroEfects.att_interval = -5;
	};
	skillUsed = null;

	//HIT
	attack: () => number = () => {
		let damage = super.attack(); //ataque normal.

		//archer Skill
		if (this.skillProb > this.getProb()) {
			// console.log(this.heroStats.name + " used Haste");
			this.skill();
		} else {
			this.heroEfects.att_interval = 0;
		}

		return damage;
	};
}
