import { AnyHero } from './classes';

export const pvp: (hero1: AnyHero, hero2: AnyHero) => void = async (hero1, hero2) => {
	//carga de la clase de cada heroe

	if (hero1.heroStats.id_class === 7) {
		hero2.defend(hero1);
	}
	if (hero2.heroStats.id_class === 7) {
		hero1.defend(hero2);
	}

	for (let i = 0; !hero1.isDead && !hero2.isDead; i++) {
		if (hero1.heroStats.curr_att_interval === i) {
			//ataca hero1
			await hero2.defend(hero1);
		}
		if (hero2.heroStats.curr_att_interval === i) {
			//ataca hero2
			await hero1.defend(hero2);
		}
	}

	//Guardar en la base de datos
	if (hero1.isDead && hero2.isDead) {
		console.log("draw");
		console.log(`${hero1.heroStats.id} ---- ${hero2.heroStats.id}`);
	}else if (hero1.isDead){
		await hero1.heroDies();
		await hero2.heroKills();
	}else if (hero2.isDead){
		await hero1.heroKills();
		await hero2.heroDies();
	}
};
