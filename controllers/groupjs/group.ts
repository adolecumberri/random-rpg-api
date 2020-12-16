import { isMethodDeclaration } from 'typescript';
import { AnyHero } from '../herojs/classes';

import { IHero } from '../../interfaces/Hero.Interface';
import { rand } from '../../commonModules/utils';
import { connection } from '../../config/database';

export class HeroGroup {
	constructor(data: AnyHero[], idCrew?: number) {
		this.heros = data;
		this.deaths = [];
		this.idCrew = idCrew ? idCrew : 0;
	}

	heros: AnyHero[];
	deaths: { turn: number; killedBy: number; hero: AnyHero }[];
	idCrew: number = 0;

	getHerosByClass: (classType: number) => AnyHero[] = (classType: number) => {
		return this.heros.filter((hero) => hero.heroStats.id_class === classType);
	};

	// getHerosIdByClass: (classType: number) => number[] = (classType: number) => {
	// 	return this.heros.filter((hero) => hero.heroStats.id_class === classType).map((hero) => hero.heroStats.id);
	// };

	// //returns heros index in "hero" attribute
	// getHerosIndexByClass: (classType: number) => number[] = (classType: number) => {
	// 	return this.heros.filter((hero) => hero.heroStats.id_class === classType).map((hero) => hero.heroStats.id);
	// };

	getHerosByAtt_interval: (att_interval: number) => AnyHero[] = (att_interval) => {
		return this.heros.filter((hero) => hero.heroStats.curr_att_interval === att_interval);
	};

	// //return indexes of heros who attack this turn
	// getHerosIndexByAtt_interval: (att_interval: number) => AnyHero[] = (att_interval) => {
	// 	return this.heros.filter((hero) => hero.heroStats.att_interval === att_interval);
	// };

	//devuelve un heroe, sino devuelve undefine
	getRandomHero: () => AnyHero = () => {
		return this.heros[rand(0, this.heros.length - 1)];
	};

	// getRandomHeroId: () => number = () => {
	// 	return this.heros[rand(0, this.heros.length - 1)].heroStats.id;
	// };

	getRandomGroup: (n: number) => AnyHero[] = (n) => {
		const copy = Array.from(this.heros);
		return Array.from(Array(n), () => copy.splice(Math.floor(copy.length * Math.random()), 1)[0]);
	};

	//cojo index y elimino al soldado
	heroDeath: (id: number, turn: number, killedBy: number) => void = (id, turn, killedBy) => {
		let indexToRemove = this.heros.findIndex((hero) => hero.heroStats.id === id);
		if (indexToRemove !== -1) {
			//Meter conexion a la bbdd
			console.log('hero ' + id + ' dies.');
			this.deaths.push({ turn, killedBy, hero: this.heros.splice(indexToRemove, 1)[0] }); //devuelve los elementos, ergo es un array.
		} else {
			console.log('hero ' + id + ' does not exist');
		}
	};

	saveHeros: (id_fight: number, turn: number) => Promise<boolean> = async (id_fight, lastFightturn) => {
		let query = `INSERT INTO groupfightstats 
		VALUES `;

		this.heros.forEach(({ fightStats: { getParamsToInsert }, heroStats }, i) => {
			let paramsToInsert = getParamsToInsert();
			query += `(${heroStats.id}, ${id_fight}, ${lastFightturn}, ${paramsToInsert}, null)`;

			//pongo una coma en todos menos el ultimo
			if (i !== this.heros.length - 1) {
				query += `,`;
			}
		});

		await new Promise((resolve, reject) => {
			connection.query(query, (err, result) => {
				resolve(console.log('heros saved'));
			});
		});

		return true;
		//connection.query();
	};

	saveHerosUpdate: () => Promise<boolean> = async () => {
		//actualización heroes currentHp
		let query = `UPDATE heros_crew SET currentHp = CASE `;

		this.heros.forEach(({ heroStats: { id, currentHp, hp, reg } }, i) => {
			//si la vida restante + regeneration*hp es < a hp, pongo la vida + la regeneracion. sino, pongo hp, que es la vida max
			let newHp = currentHp + hp * reg < hp ? currentHp + hp * reg : hp;
			query += ` WHEN id_hero = ${id} AND id_crew = ${this.idCrew} THEN ${newHp}`;
		});
		query += ` END 
		WHERE id_hero IN (`;

		this.heros.forEach(({ heroStats: { id, currentHp, hp, reg } }, i) => {
			query += `${id}`;
			if (i !== this.heros.length - 1) {
				query += `,`;
			}
		});

		query += `);`;

		console.log(query);
		await new Promise((resolve, reject) => {
			connection.query(query, (err, result) => {
				resolve(console.log('heros who survived updated'));
			});
		});

		return true;
	};

	saveDeaths: (id_fight: number, turn: number) => Promise<boolean> = async (id_fight, lastFightturn) => {
		let query = `INSERT INTO groupfightstats 
		VALUES `;

		this.deaths.forEach(
			(
				{
					hero: {
						fightStats: { getParamsToInsert },
						heroStats,
					},
					killedBy,
					turn,
				},
				i
			) => {
				let paramsToInsert = getParamsToInsert();
				query += `(${heroStats.id}, ${id_fight}, ${turn}, ${paramsToInsert}, ${killedBy})`;

				//pongo una coma en todos menos el ultimo
				if (i !== this.deaths.length - 1) {
					query += `,`;
				}
			}
		);

		// console.log(query);

		await new Promise((resolve, reject) => {
			connection.query(query, (err, result) => {
				resolve(console.log('dead heroes burried'));
			});
		});

		return true;
	};

	updateDeaths: () => Promise<boolean> = async () => {
		//actualización heroes currentHp
		let query = `UPDATE heros_crew SET hero_isalive = CASE `;

		this.deaths.forEach(
			({
				hero: {
					heroStats: { id, currentHp, hp, reg },
				},
			}) => {
				//si la vida restante + regeneration*hp es < a hp, pongo la vida + la regeneracion. sino, pongo hp, que es la vida max
				query += ` WHEN id_hero = ${id} AND id_crew = ${this.idCrew} THEN 0 `;
			}
		);
		query += ` END
		, currenthp = CASE `;

		this.deaths.forEach(
			({
				hero: {
					heroStats: { id, currentHp, hp, reg },
				},
			}) => {
				query += ` WHEN id_hero = ${id} THEN ${currentHp} `;
			}
		);

		query += ` END 
		WHERE id_hero IN ( `;

		this.deaths.forEach(
			(
				{
					hero: {
						heroStats: { id },
					},
				},
				i
			) => {
				query += `${id}`;
				if (i !== this.deaths.length - 1) {
					query += `,`;
				}
			}
		);

		query += ` );`;

		console.log(query);
		await new Promise((resolve, reject) => {
			connection.query(query, (err, result) => {
				resolve(console.log('heros who died, updated'));
			});
		});

		return true;
	};
}
