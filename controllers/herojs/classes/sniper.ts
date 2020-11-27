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
	skill: () => void = () => {}; //the skill is on the attack
	skillUsed = true;

	attack: (dmgEf?: number) => number = (dmgEf = 0) => {
		let { id, name, surname, accuracy, crit, critDmg, dmg } = this.heroStats;
		let damage = 0;

		if (this.skillUsed ) {
			this.fightStats.addSkillUses();
			if (0.75 > this.getProb()) {
				//golpeo?
				if (crit > this.getProb()) {
					//stats
					this.fightStats.addCrit();
					//critico
					damage = this.rand((dmg + dmgEf) * (critDmg + 1) * 0.95, (dmg + dmgEf) * (critDmg + 1) * 1.15);
					//console.log(`${id}.${name} ${surname}: ${damage}dmg!`);
				} else {
					//stats
					this.fightStats.addHit();
					damage = this.rand((dmg + dmgEf) * 0.95, (dmg + dmgEf) * 1.15);
					//console.log(`${id}.${name} ${surname}: ${damage}dmg`);
				}
			}else {
				this.fightStats.addMiss();
			}
			this.skillUsed = false; //Apago la skill
		} else {
			if (accuracy > this.getProb()) {
				//golpeo?
				if (crit > this.getProb()) {
					//stats
					this.fightStats.addCrit()
					//critico
					damage = this.rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15);
					//console.log(`${id}.${name} ${surname}: ${damage}dmg!`);
				} else {
					//stats
					this.fightStats.addHit();
					damage = this.rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15);
					//console.log(`${id}.${name} ${surname}: ${damage}dmg`);
				}
			}else {
				this.fightStats.addMiss();
			}
			this.calcNextTurn();
		}
		
		return damage;
	};

	start: any = () => this.skill();
}
