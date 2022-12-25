import { GENDERS } from '../constants';
import { VARIATION } from '../constants/general';
import { hero_stats } from '../interfaces/hero.interfaces';
import { BASE_STATS, CLASS_STATS_BY_NAME } from '../jsons/stats'
import { getRandomNameByGender, rand } from './utils'

const createHero = ({
    heroClass,
    gender,
}: {
    heroClass?: keyof typeof CLASS_STATS_BY_NAME,
    gender?: keyof typeof GENDERS
}) => {
    let choosen_hero_class_stats: hero_stats;
    let choosen_gender: typeof GENDERS[keyof typeof GENDERS];

    //Choosed Hero.
    if (heroClass) {
        choosen_hero_class_stats = CLASS_STATS_BY_NAME[heroClass]
    } else {
        let number_of_hero_classes = Object.keys(CLASS_STATS_BY_NAME).length
        let id_random_hero_class = rand(0, number_of_hero_classes - 1) //indice del CLASS_STATS que se escoge
        let name_random_class = Object.keys(CLASS_STATS_BY_NAME)[id_random_hero_class] as keyof typeof CLASS_STATS_BY_NAME
        choosen_hero_class_stats = CLASS_STATS_BY_NAME[name_random_class]
    }

    //Choosed Gender
    if (gender) {
        choosen_gender = GENDERS[gender]
    } else {
        let gender_of_the_hero = Object.keys(GENDERS).length
        let id_random_gender = rand(0, gender_of_the_hero - 1) //indice del CLASS_STATS que se escoge
        let name_random_class = Object.keys(GENDERS)[id_random_gender] as keyof typeof GENDERS
        choosen_gender = GENDERS[name_random_class]
    }

    let full_name = getRandomNameByGender(choosen_gender)
    let final_stats = calculateHeroStats(BASE_STATS, choosen_hero_class_stats, VARIATION)
}

const calculateHeroStats: (baseStats: hero_stats, classStats: hero_stats, variation: number) => void = (baseStats, classStats, variation) => {

}


const getCharacterStats = () => {
    let basic_stats = BASE_STATS


}

export {
    getCharacterStats
}