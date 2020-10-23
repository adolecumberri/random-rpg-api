
import {rand} from './utils'

//Crear heroe
let createHero = () => {
	let id_class = rand(0, classStats.length - 1); //ES EL INDICE -> el valor es id_class + 1
	let choosedClassStats = classStats[id_class];

	let randHero: ({ id: number; name: string } & IHeroStats)[] | any = {};
	randHero = { ...getStats(basicStats, choosedClassStats) };
	randHero['id_class'] = id_class + 1; //choosedClassStats["name"];
	randHero['gender'] = rand(0, 1);
	randHero['name'] = randName(randHero['gender']);
	// Correcciones de decimales
	randHero['hp'] = Math.round(randHero['hp']);
	randHero['currentHp'] = randHero.hp;
	randHero['dmg'] = Math.round(randHero['dmg']);
	randHero['def'] = Math.round(randHero['def']);
	return randHero;
};



export {createHero}