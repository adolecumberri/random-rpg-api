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

	end: () => void = () => {
		if (this.heroStats.currentHp < this.heroStats.hp * 0.6 && this.skillProb > this.getProb()) {
			this.skill();
		}
	};
}
