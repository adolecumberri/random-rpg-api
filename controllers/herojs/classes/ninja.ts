import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';

export class Ninja {
	constructor(data: IHero) {
		this.heroStats = { ...data, curr_att_interval: data.att_interval };
		this.heroEfects = {
			dmg: 0,
			def: 0,
			dex: 0,
		};
	}

	//Propiedades.
	heroStats: IHero; //Estadisticas
	heroEfects: IHeroEfects; //E stados cambiados
	isDead = false;
	skillUsed = false;

	//BACK STAB
	skillProb = 0.17;
	skill: any = (damage: number) => damage * 2.05;

	//Beginning -> function executed when the figth starts. just 1 time.
	beginning: any = () => {};

	//START
	start: any = () => {};

	//HIT
	hit: any = (): { type: string; dmg: number } => {
		let solution: { type: string; dmg: number } = {
			type: '',
			dmg: 0,
		};
		let { accuracy, crit, critDmg, dmg } = this.heroStats;
		let { dmg: dmgEf } = this.heroEfects;

		//ninja will use the skill?
		this.skillProb < getProb() ? (this.skillUsed = true) : (this.skillUsed = false);

		if (this.skillUsed) {
			//USO SKILL ERGO ATACO 3 veces
			solution.type = 'skill';
			for (let i = 0; i < 3; i++) {
				accuracy > getProb()
					? // do it hit?
					  crit > getProb() || this.skillUsed
						? //is it critical
						  (solution.dmg += rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15) * 0.7)
						: (solution.dmg += rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15) * 0.7)
					: (solution.dmg += 0);
			}
		} else {
			//ATACO NORMAL
			accuracy > getProb()
				? // do it hit?
				  crit > getProb()
					? //is it critical? OR skill is activated?
					  (solution = {
							type: 'crit',
							dmg: rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15),
					  })
					: (solution = {
							type: 'normal',
							dmg: rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15),
					  })
				: (solution = { type: 'miss', dmg: 0 });
		}

		return solution;
	};

	//CALC DAMAGE AFTER BLOCKING
	isHitted: any = (damage: number): { evaded: boolean; dmg: number } => {
		let { def, evasion } = this.heroStats;
		let { def: defEf } = this.heroEfects;
		let finalDamage = Math.floor((damage * (100 - (def + defEf) * 0.9)) / 100 - (def + defEf) * 0.29);

		return {
			dmg: finalDamage <= 0 ? 1 : finalDamage,
			evaded: evasion >= getProb() ? true : false,
		}; //si es menos de 0, el daño es 1
	};

	//SET new HP
	setHp: any = (newHp: number) => {
		this.heroStats = { ...this.heroStats, currentHp: newHp };
	};

	//END
	end: any = (newCurHp: number): boolean => {
		if (newCurHp <= 0) {
			this.isDead = true;
		}

		return this.isDead;
	};

	//HERO DIES
	heroDead: any = () =>
		new Promise((res, rej) => {
			connection.query(`UPDATE hero SET isAlive = 0 WHERE id = ${this.heroStats.id}`);
		});

	//HERO WINS
	heroWins: any = () =>
		new Promise((res, rej) => {
			connection.query(`UPDATE hero SET kills = ${this.heroStats.kills + 1} WHERE id = ${this.heroStats.id}`);
		});

	calcNextTurn = (curDex: number) => (curDex += this.heroStats.att_interval);
}

//function to generate rand numbers
const rand = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

//function to load probabilities.
const getProb = () => Math.random();
