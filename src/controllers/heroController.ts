
// controllers/heroController.ts
import { Request, Response } from "express";
import { HEROES_NAMES } from "../constants";
import { heroFactory, restoreHero } from "../heroes/heroes";
import { HeroIdentity, StoredHero } from "../types";
import { Character, Stats } from "rpg-ts";

const createHero = (className: keyof typeof HEROES_NAMES, options: HeroIdentity) => {

    let localClassName = className?.toLocaleUpperCase() as keyof typeof HEROES_NAMES;
    // Verificar si el className es válido
    if (!(localClassName in HEROES_NAMES)) {
        //get random classname from HEROES_NAMES
        localClassName = Object.keys(HEROES_NAMES)[Math.floor(Math.random() * Object.keys(HEROES_NAMES).length)] as keyof typeof HEROES_NAMES;
    }

    console.log("localClassName", localClassName)

    // Crear el personaje usando la función correspondiente de heroFactory
    const createHeroFunc = heroFactory[localClassName];

    // Suponiendo que el personaje tiene un método para convertirse en JSON
    return createHeroFunc(options);

};


const createHeroes = ( totalHeroes: number, heroTypes: { [x in keyof typeof HEROES_NAMES]?: number }) => {
    const heroList: any[] = [];

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


const restoreCharacter = (storedHero: StoredHero): Character => {

    const createHeroFunc = restoreHero[storedHero.className.toUpperCase() as keyof typeof HEROES_NAMES];
  
    return createHeroFunc(storedHero);
  }

export {
    createHero,
    createHeroes,
    restoreCharacter
}
// 