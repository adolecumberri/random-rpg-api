import { isMethodDeclaration } from 'typescript';
import { AnyHero } from '../herojs/classes';

import { IHero } from '../../interfaces/Hero.Interface';
import { rand } from '../../commonModules/utils';

export class HeroGroup {
	constructor(data: AnyHero[]) {
		this.heros = data;
	}

	heros: AnyHero[];

	getHerosByClass: (classType: number) => AnyHero[] = (classType: number) => {
		return this.heros.filter((hero) => hero.heroStats.id_class === classType);
	};

	getRandon: any = () => {
		return this.heros[rand(0, this.heros.length - 1)];
	};

	getRandonGroup: (n: number) => AnyHero[] = (n) => {
		const copy = Array.from(this.heros);
		return Array.from(Array(n), () => copy.splice(Math.floor(copy.length * Math.random()), 1)[0]);
	};

	//cojo index y elimino al soldado
	heroDeath: any = (id: number) => {
		let indexToRemove = this.heros.findIndex((hero) => hero.heroStats.id === id);
		if (indexToRemove !== -1) {
			//Meter conexion a la bbdd
			console.log('hero ' + id + ' dies.');
			return this.heros.splice(indexToRemove, 1);
		} else {
			console.log('hero ' + id + ' does not exist');
		}
	};

	// orderByStats: any = (stat: keyof IHero) => {
	// 	this.heros.sort((a, b) => (a.heroStats[stat] as any) - (b.heroStats[stat] as any));
	// };

	// setHeros: any = (newHeros: AnyHero[]) => {
	// 	this.heros = newHeros;
	// };
}
