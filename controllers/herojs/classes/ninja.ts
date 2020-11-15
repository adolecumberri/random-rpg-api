import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';
import { Hero } from '../commonHero';

export class Ninja extends Hero {
	constructor(data: IHero) {
		super({ ...data, curr_att_interval: data.att_interval });
	}

	//Propiedades.
	heroEfects: IHeroEfects = {
		dmg: 0,
		def: 0,
		att_interval: 0,
	}; //E stados cambiados

	//BACK STAB
	skillProb = 0.17;
	//skill: any = (damage: number) => damage * 2.05;
	skill: () => number = () => {
		let { dmg, critDmg, accuracy, crit } = this.heroStats;
		let damage = 0;

		for (let i = 0; i < 3; i++) {
			if (accuracy > this.getProb()) {
				if (crit > this.getProb()) {
					damage += this.rand(dmg * (critDmg + 1) * 0.85, dmg * (critDmg + 1) * 1.15 * 0.7);
				} else {
					damage += this.rand(dmg * 0.85, dmg * 1.15 * 0.7);
				}
			}
		}

		return damage;
	};
	skillUsed = false;

	//HIT
	attack: () => number = () => {
		let { id, name, surname, accuracy, crit, critDmg, dmg } = this.heroStats;
		let damage = 0;

		if (this.skillProb < this.getProb()) {
			damage = this.skill();
			
		} else {
			if (accuracy > this.getProb()) {
				//golpeo?
				if (crit > this.getProb()) {
					//critico
					damage = this.rand(dmg * (critDmg + 1) * 0.85, dmg * (critDmg + 1) * 1.15);
					console.log(`${id}.${name} ${surname}: ${damage}dmg!`);
				} else {
					damage = this.rand(dmg * 0.85, dmg * 1.15);
					console.log(`${id}.${name} ${surname}: ${damage}dmg`);
				}
			}
		}

		console.log(`${id}.${name} ${surname} did ${damage} `);
		this.calcNextTurn();
		return damage;
	};
}
