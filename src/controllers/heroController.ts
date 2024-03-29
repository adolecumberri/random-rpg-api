import { HEROES_NAMES } from "../constants";
import { heroFactory } from "../heroes/heroes";
import { Hero, HeroIdentity } from "../types";

const createHero = (className: keyof typeof HEROES_NAMES | undefined, options: HeroIdentity | undefined): Hero => {

    let className_key = className?.toLocaleUpperCase() as keyof typeof HEROES_NAMES;
    // Verificar si el className es válido
    if (!(className_key in HEROES_NAMES)) {
        //get random classname from HEROES_NAMES
        className_key = Object.keys(HEROES_NAMES)[Math.floor(Math.random() * Object.keys(HEROES_NAMES).length)] as keyof typeof HEROES_NAMES;
    }

    // Crear el personaje usando la función correspondiente de heroFactory
    const createHeroFunc = heroFactory[className_key];

    // Suponiendo que el personaje tiene un método para convertirse en JSON
    return createHeroFunc(options);

};

/**
 * This function will create a number of random heroes equal to totalHeroes, but will have on consideration the heroTypes object that request certain types of heroes.
 * @param totalHeroes 
 * @param heroTypes 
 * @returns 
 */
const createHeroes = (totalHeroes: number, heroTypes: { [x in keyof typeof HEROES_NAMES]?: number }) => {
    const heroList: Hero[] = [];

    // Verificar si se especificó el número total de héroes
    if (!totalHeroes || totalHeroes === 0) {
        // Si no se especificó, el número total de héroes será la suma de los valores en el objeto de tipos de héroes
        totalHeroes = Object.values(heroTypes).reduce((sum, count) => sum + (count || 0), 0);
    }

    // Verificar si la suma de los valores en el objeto de tipos de héroes es mayor que el número total de héroes
    const totalHeroCount = Object.values(heroTypes).reduce((sum, count) => sum + (count || 0), 0);
    if (totalHeroCount > totalHeroes) {
        throw new Error('The sum of the hero types is greater than the total number of heroes');
    }

    // Crear héroes específicos según la lista de tipos y cantidades especificadas
    for (const [heroType, count] of Object.entries(heroTypes)) {
        if (count) {
            for (let i = 0; i < count; i++) {
                const createHeroFunc = heroFactory[heroType.toLocaleUpperCase() as keyof typeof HEROES_NAMES];
                const character = createHeroFunc({} as HeroIdentity);
                heroList.push(character);
            }
        }
    }

    // Crear héroes aleatorios para completar el número total de héroes
    const remainingCount = totalHeroes - heroList.length;
    for (let i = 0; i < remainingCount; i++) {
        const randomHeroType = Object.keys(HEROES_NAMES)[Math.floor(Math.random() * Object.keys(HEROES_NAMES).length)];
        const createHeroFunc = heroFactory[randomHeroType as keyof typeof HEROES_NAMES];
        const character = createHeroFunc({} as HeroIdentity);
        heroList.push(character);
    }

    return heroList;
};



export {
    createHero,
    createHeroes,
}
// 