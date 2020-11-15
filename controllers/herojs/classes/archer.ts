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
		let { id, name, surname, accuracy, crit, critDmg, dmg } = this.heroStats;
		let { dmg: dmgEf } = this.heroEfects;
		let damage = 0;

		if (accuracy > this.getProb()) {
			//golpeo?
			if (crit > this.getProb()) {
				//critico
				damage = this.rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15);
				//console.log(`${id}.${name} ${surname}: ${damage}dmg! 8`);
			} else {
				damage = this.rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15);
				//console.log(`${id}.${name} ${surname}: ${damage}dmg 9`);
			}
		}

		//archer Skill
		if (this.skillProb > this.getProb()) {
			//console.log(this.heroStats.name + " used Haste 10");
			this.skill();
		} else {
			this.heroEfects.att_interval = 0;
		}
		//console.log(`${this.heroStats.id} --- ${this.heroStats.curr_att_interval}`);
		this.calcNextTurn(this.heroEfects.att_interval);
		//console.log(`${this.heroStats.id} --- ${this.heroStats.curr_att_interval}`);
		return damage;
	};
}
