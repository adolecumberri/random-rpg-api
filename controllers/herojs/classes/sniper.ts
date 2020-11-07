import { connection } from '../../../config/database';
import { IHero, IHeroEfects } from '../../../interfaces/Hero.Interface';

export class Sniper {
	constructor(data: IHero) {
		this.heroStats = { ...data };
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

	//Head Shot
	skill: any = () => {
		let { crit, dmg, critDmg } = this.heroStats;
		let solution: { type: string; dmg: number } = {
			type: '',
			dmg: 0,
		};

		0.75 > getProb()
			? // do it hit?
			  crit > getProb()
				? //is it critical?
				  (solution = {
						type: 'crit',
						dmg: rand(dmg * (critDmg + 1) * 0.85, dmg * (critDmg + 1) * 1.15),
				  })
				: (solution = {
						type: 'normal',
						dmg: rand(dmg * 0.85, dmg * 1.15),
				  })
			: (solution = { type: 'miss', dmg: 0 });

		return solution;
	};

	//Beginning -> function executed when the figth starts. just 1 time.
	beginning: any = () => this.skill();

	//START
	start: any = () => {};

	//HIT
	hit: any = (): { type: string; dmg: number } => {
		let solution: { type: string; dmg: number; state?: any } = {
			type: '',
			dmg: 0,
			state: {},
		};
		let { accuracy, crit, critDmg, dmg } = this.heroStats;
		let { dmg: dmgEf } = this.heroEfects;
		accuracy > getProb()
			? // do it hit?
			  crit > getProb()
				? //is it critical?
				  (solution = {
						type: 'crit',
						dmg: rand((dmg + dmgEf) * (critDmg + 1) * 0.85, (dmg + dmgEf) * (critDmg + 1) * 1.15),
				  })
				: (solution = {
						type: 'normal',
						dmg: rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15),
				  })
			: (solution = { type: 'miss', dmg: 0 });

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
