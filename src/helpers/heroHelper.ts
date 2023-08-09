import { Character, Stats } from "rpg-ts";
import { CLASSES_STATS, COMMON_STATS, FEMALE_NAMES, HEROES_NAMES, MALE_NAMES, SURNAMES } from "../constants";
import { Hero } from "../types";
import { getRandomInt } from "./commonHelper";

const getStatsByClassName = (className: keyof typeof HEROES_NAMES, variation = 0.15): Omit<Stats, 'totalHp'> => {

    const classStats = CLASSES_STATS[className];

     if (!classStats) {
        throw new Error(`ClassName ${className} not found`);
    }

    const stats: { [x in keyof typeof COMMON_STATS]?: number} = {};

    for (let key in COMMON_STATS) {
        const common = COMMON_STATS[key as keyof typeof COMMON_STATS] as number;
        const classValue = classStats[key as keyof typeof COMMON_STATS] as number;
        const total = common + classValue;

        // Asegura que la variación sea entre 0.85 y 1.15
        const lowerBound = total * (1 - variation);
        const upperBound = total * (1 + variation);

        if(!stats[key as keyof typeof COMMON_STATS]) stats[key as keyof typeof COMMON_STATS] = 0;

        // Calcula un valor aleatorio entre el límite inferior y superior
        stats[key as keyof typeof COMMON_STATS] = getRandomInt(lowerBound, upperBound);
    }

    return stats as Omit<Stats, 'totalHp'>;
}

const getMaleName = () => MALE_NAMES[getRandomInt(0, MALE_NAMES.length)];

const getFemaleName = () => FEMALE_NAMES[getRandomInt(0, FEMALE_NAMES.length)];

const getSurname = () => SURNAMES[getRandomInt(0, SURNAMES.length)];

export {
    getStatsByClassName,
    getMaleName,
    getFemaleName,
    getSurname
}
