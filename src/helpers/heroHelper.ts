import { BaseCharacter, Character, CharacterCallbacks, Stats } from "rpg-ts";
import { CLASSES_STATS, COMMON_STATS, FEMALE_NAMES, HEROES_NAMES, MALE_NAMES, SURNAMES } from "../constants";
import { Hero } from "../types";
import { getRandomInt } from "./commonHelper";

const keysToControl = [{
    name: 'crit',
    max: 100,
    min: 0
},
{
    name: 'accuracy',
    max: 100,
    min: 0
},
{
    name: 'evasion',
    max: 100,
    min: 0
},
{
    name: 'attackInterval',
    max: 100,
    min: 2
},
];

const getStatsByClassName = (className: keyof typeof HEROES_NAMES, variation = 0.15): Stats => {

    const classStats = CLASSES_STATS[className];

    if (!classStats) {
        throw new Error(`ClassName ${className} not found`);
    }

    const stats: { [x in keyof typeof COMMON_STATS]?: number } = {};

    for (let key in COMMON_STATS) {
        const common = COMMON_STATS[key as keyof typeof COMMON_STATS] as number;
        const classValue = classStats[key as keyof typeof COMMON_STATS] as number;
        const total = common + classValue;

        // Asegura que la variación sea entre 0.85 y 1.15
        const lowerBound = total * (1 - variation);
        const upperBound = total * (1 + variation);

        if (!stats[key as keyof typeof COMMON_STATS]) stats[key as keyof typeof COMMON_STATS] = 0;

        // Calcula un valor aleatorio entre el límite inferior y superior
        let randomValue = getRandomInt(lowerBound, upperBound);

        stats[key as keyof typeof COMMON_STATS] = randomValue;
    }

    return controlHeroStats(stats as Stats);
}

const getMaleName = () => MALE_NAMES[getRandomInt(0, MALE_NAMES.length)];

const getFemaleName = () => FEMALE_NAMES[getRandomInt(0, FEMALE_NAMES.length)];

const getSurname = () => SURNAMES[getRandomInt(0, SURNAMES.length)];

const controlHeroStats = (stats: Stats): Stats => {
    // Aplica los límites para las estadísticas en keysToControl
    keysToControl.forEach(({ name, min, max }) => {
        stats[name as keyof Stats] = Math.min(max, Math.max(min, stats[name as keyof Stats]));
    });

    return stats;
}

const killedHeroCallback: CharacterCallbacks['die'] = (c, killer) => {
    killer.levelManager?.gainExperience(c.levelManager?.xpGivenFunction(c.levelManager.currentLevel), killer);
    (killer as unknown as Hero).kills++;
  };

export {
    getStatsByClassName,
    getMaleName,
    getFemaleName,
    getSurname,
    controlHeroStats,
    killedHeroCallback,
}
