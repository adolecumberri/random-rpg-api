import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Sniper extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	//Propiedades.
	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	skillProb = 1;
	//Head Shot
	skill: () => number = () => {
		let { crit, dmg, critDmg } = this.heroStats;
		let damage = 0;

		if (0.75 > this.getProb()) {
			if (crit > this.getProb()) {
				damage = this.rand(dmg * (critDmg + 1) * 0.85, dmg * (critDmg + 1) * 1.15);
			} else {
				damage = this.rand(dmg * 0.85, dmg * 1.15);
			}
		}

		return damage;
	};
	skillUsed = false;

	start: any = () => this.skill();
}
