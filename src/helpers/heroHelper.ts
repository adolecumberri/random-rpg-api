import { CLASSES_STATS, COMMON_STATS, FEMALE_NAMES, MALE_NAMES, SURNAMES } from "../constants";
import { HeroStats } from "../types";
import { rand } from "./commonHelper";


const getStatsByClassId = (classId: number, variation = 0.15): Partial<HeroStats> => {
    const classStats = CLASSES_STATS[classId];

    if (!classStats) {
        throw new Error(`ClassId ${classId} not found`);
    }

    const stats: Partial<HeroStats> = {};

    for (let key in COMMON_STATS) {
        const common = COMMON_STATS[key as keyof typeof COMMON_STATS];
        const classValue = classStats[key as keyof typeof COMMON_STATS];
        const total = common + classValue;

        // Asegura que la variación sea entre 0.85 y 1.15
        const lowerBound = total * (1 - variation);
        const upperBound = total * (1 + variation);

        // Calcula un valor aleatorio entre el límite inferior y superior
        stats[key as keyof typeof COMMON_STATS] = Math.random() * (upperBound - lowerBound) + lowerBound;
    }

    return stats;
}

const getMaleName = () => MALE_NAMES[rand(0, MALE_NAMES.length)];

const getFemaleName = () => FEMALE_NAMES[rand(0, FEMALE_NAMES.length)];

const getSurname = () => SURNAMES[rand(0, SURNAMES.length)];


export {
    getStatsByClassId,
    getMaleName,
    getFemaleName,
    getSurname
}
