import { GENDERS } from "../constants";
import MALE_NAMES from '../jsons/male_names'
import FEMALE_NAMES from "../jsons/female_names";
import SURNAMES from '../jsons/surnames';

export const rand = (max: number, min = 0) => Math.round(Math.random() * (max - min) + min);

export const getRandomNameByGender = (gender: typeof GENDERS[keyof typeof GENDERS]) => {
    let name: string = '';
    let surname: string = '';

    if (gender === GENDERS.MALE) {
        name = MALE_NAMES[rand(0, MALE_NAMES.length - 1)]
    }

    if (gender === GENDERS.FEMALE) {
        name = FEMALE_NAMES[rand(0, FEMALE_NAMES.length - 1)]
    }

    if (gender === GENDERS.OTHER) {
        name = rand(0, 1) ? MALE_NAMES[rand(0, MALE_NAMES.length - 1)] : FEMALE_NAMES[rand(0, FEMALE_NAMES.length - 1)]
    }

    surname = SURNAMES[rand(0, SURNAMES.length - 1)]

    return {
        name,
        surname
    }
}