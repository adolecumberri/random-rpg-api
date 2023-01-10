import { GENDERS } from '../constants';
import { VARIATION } from '../constants/general';
import { hero_stats, hero_with_class_stats } from '../interfaces/hero.interfaces';
import { BASE_STATS, CLASS_STATS_BY_NAME } from '../jsons/stats'
import { getRandomNameByGender, rand } from './utils'

interface createHeroParams {
    class?: keyof typeof CLASS_STATS_BY_NAME,
    gender?: keyof typeof GENDERS
}

const createHero = ({
    type,
    gender
}: {
    type?: keyof typeof CLASS_STATS_BY_NAME,
    gender?: keyof typeof GENDERS
} = {}) => {
    let choosen_hero_class_stats: hero_with_class_stats;
    let choosen_gender: typeof GENDERS[keyof typeof GENDERS];

    //Choosed Hero.
    type = type?.toLocaleUpperCase() as keyof typeof CLASS_STATS_BY_NAME
    if (type && type in CLASS_STATS_BY_NAME) {
        choosen_hero_class_stats = CLASS_STATS_BY_NAME[type]
    } else {
        let number_of_hero_classes = Object.keys(CLASS_STATS_BY_NAME).length
        let id_random_hero_class = rand(0, number_of_hero_classes - 1) //indice del CLASS_STATS que se escoge
        let name_random_class = Object.keys(CLASS_STATS_BY_NAME)[id_random_hero_class] as keyof typeof CLASS_STATS_BY_NAME
        choosen_hero_class_stats = CLASS_STATS_BY_NAME[name_random_class]
    }

    //Choosed Gender
    gender = gender?.toLocaleUpperCase() as keyof typeof GENDERS
    if (gender && gender in GENDERS) {
        choosen_gender = GENDERS[gender]
    } else {
        let gender_of_the_hero = Object.keys(GENDERS).length
        let id_random_gender = rand(0, gender_of_the_hero - 1) //indice del CLASS_STATS que se escoge
        let name_random_class = Object.keys(GENDERS)[id_random_gender] as keyof typeof GENDERS
        choosen_gender = GENDERS[name_random_class]
    }

    let full_name = getRandomNameByGender(choosen_gender)
    let final_stats: hero_with_class_stats = {
        name: full_name.name,
        surname: full_name.surname,
        gender: choosen_gender,
        id_class: choosen_hero_class_stats.id_class,
        class_name: choosen_hero_class_stats.class_name,
        total_hp: 0,
        ...calculateHeroStats(BASE_STATS, choosen_hero_class_stats, VARIATION)
    }

    final_stats.hp = Math.round(final_stats.hp)
    final_stats.attack = Math.round(final_stats.attack)
    final_stats.defence = Math.round(final_stats.defence)
    final_stats.total_hp = final_stats.hp
    return final_stats
}

const calculateHeroStats: (baseStats: hero_stats, classStats: hero_stats, variation: number) => hero_stats = (baseStats, classStats, variation) => {
    let finalStat: any | hero_stats = { //ts throws error.
        hp: 0,
        attack: 0,
        defence: 0,
        crit: 0,
        crit_multiplier: 0,
        accuracy: 0,
        evasion: 0,
        attack_interval: 0,
        reg: 0
    };

    Object.keys(baseStats).forEach((key) => {
        let value = Number(baseStats[key as keyof hero_stats]) + Number(classStats[key as keyof hero_stats]) + Number.EPSILON;
        finalStat[key as keyof hero_stats] = Math.round((Math.random() * (value * (1 + variation) - value * (1 - variation)) + value * (1 - variation)) * 100) / 100;
    });

    return finalStat;
}

const getCharacterStats = () => {
    let basic_stats = BASE_STATS
}

export {
    getCharacterStats,
    createHero
}