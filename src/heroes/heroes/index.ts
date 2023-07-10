import { getRandomInt, Character } from "rpg-ts";
import { getMaleName, getFemaleName, getSurname, getStatsByClassName } from "../../helpers";
import { HeroOptions } from "../../types";
import { HEROES_NAMES, SKILL_PROBABILITY } from "../../constants";
import { haste } from '../skills';

const createArcher = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
            skill: {
                probability: SKILL_PROBABILITY[HEROES_NAMES.ARCHER],
            },
            className: 'Archer',
            statusManager: true,
            actionRecord: true,
            callbacks: {
                criticalAttack: haste,
                normalAttack: haste,
            },
            stats: getStatsByClassName(HEROES_NAMES.ARCHER) ,
        });
}

export {
    createArcher
}