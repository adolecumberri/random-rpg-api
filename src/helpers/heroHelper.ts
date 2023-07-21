import { Character } from "rpg-ts";
import { CLASSES_STATS, COMMON_STATS, FEMALE_NAMES, HEROES_NAMES, MALE_NAMES, SURNAMES } from "../constants";
import { Hero, HeroIdentity, RawHeroStats, StoredHero } from "../types";
import { getRandomInt } from "./commonHelper";

const getIdByClassName = (className: string) => {
    for (let key in CLASSES_STATS) {
        if (CLASSES_STATS[key as keyof typeof CLASSES_STATS].className === className) {
            return CLASSES_STATS[key as keyof typeof CLASSES_STATS].idClass;
        }
    }
};

const getNameByClassId = (classId: number) => {
    for (let key in CLASSES_STATS) {
        if (CLASSES_STATS[key as keyof typeof CLASSES_STATS].idClass === classId) {
            return CLASSES_STATS[key as keyof typeof CLASSES_STATS].className;
        }
    }
};

const getStatsByClassId = (classId: number, variation = 0.15): Partial<RawHeroStats> => {

    const classStats = CLASSES_STATS[getNameByClassId(classId) as keyof typeof CLASSES_STATS];

    if (!classStats) {
        throw new Error(`ClassId ${classId} not found`);
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

    return stats as Partial<RawHeroStats>;
}

const getStatsByClassName = (className: keyof typeof HEROES_NAMES, variation = 0.15): Partial<RawHeroStats> => {

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

    return stats as Partial<RawHeroStats>;
}

const getMaleName = () => MALE_NAMES[getRandomInt(0, MALE_NAMES.length)];

const getFemaleName = () => FEMALE_NAMES[getRandomInt(0, FEMALE_NAMES.length)];

const getSurname = () => SURNAMES[getRandomInt(0, SURNAMES.length)];

const convertCharacterToStoredHero = (character: Hero): StoredHero => {
    return {
        id: character.id,
        isAlive: character.isAlive,
        name: character.name,
        stats: character.stats,
        surname: character.surname,
        className: character.className,
        gender: character.gender,
    }
}

export {
    getIdByClassName,
    getNameByClassId,
    getStatsByClassId,
    getStatsByClassName,
    getMaleName,
    getFemaleName,
    getSurname,
    convertCharacterToStoredHero
}
