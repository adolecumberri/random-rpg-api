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

	getRandom: any = () => {
		return this.heros[rand(0, this.heros.length - 1)];
	};

	//cojo index y elimino al soldado.
	//TOD: debería hacer aquí la conexion a la bbdd??
	heroDeath: any = (index: number) => {
		return this.heros.splice(index, 1);
	};

	orderByStats: any = (stat: keyof IHero) => {
		this.heros.sort((a, b) => (a.heroStats[stat] as any) - (b.heroStats[stat] as any));
	};

	setHeros: any = (newHeros: AnyHero[]) => {
		this.heros = newHeros;
	};
}
