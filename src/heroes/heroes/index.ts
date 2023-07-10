import { getRandomInt, Character } from "rpg-ts";
import { getMaleName, getFemaleName, getSurname, getStatsByClassName } from "../../helpers";
import { HeroOptions } from "../../types";
import { HEROES_NAMES, SKILL_PROBABILITY } from "../../constants";
import { fervor, haste, holyLight, rage, riposte, shieldGesture, skipeShield, tripleAttack, unoticedShot } from '../skills';

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
        className: HEROES_NAMES.ARCHER,
        statusManager: true,
        actionRecord: true,
        callbacks: {
            criticalAttack: haste,
            normalAttack: haste,
        },
        stats: getStatsByClassName(HEROES_NAMES.ARCHER),
    });
}

const createBerserk = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[HEROES_NAMES.BERSERKER],
        },
        className: HEROES_NAMES.BERSERKER,
        statusManager: true,
        actionRecord: true,
        callbacks: {
            receiveDamage: rage,
        },
        stats: getStatsByClassName(HEROES_NAMES.BERSERKER),
    });
}

const createDefender = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[HEROES_NAMES.BERSERKER],
        },
        className: SKILL_PROBABILITY[HEROES_NAMES.BERSERKER],
        statusManager: true,
        actionRecord: true,
        callbacks: {
            receiveDamage: skipeShield
        },
    });
}

const createFencer = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[HEROES_NAMES.FENCER],
        },
        className: SKILL_PROBABILITY[HEROES_NAMES.FENCER],
        statusManager: true,
        actionRecord: true,
        callbacks: {
            afterAnyDefence: riposte,
        },
    });
}

const createNinja = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[HEROES_NAMES.NINJA]
        },
        className: SKILL_PROBABILITY[HEROES_NAMES.NINJA],
        statusManager: true,
        actionRecord: true,
        callbacks: {
            afterAnyAttack: tripleAttack,
        },
    });
};

const createPaladin = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[HEROES_NAMES.PALADIN]
        },
        className: SKILL_PROBABILITY[HEROES_NAMES.PALADIN],
        statusManager: true,
        actionRecord: true,
        callbacks: {
            afterTurn: holyLight,
        },
    });
};

const createSniper = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[HEROES_NAMES.SNIPER],
            use: unoticedShot,
            isUsed: false,
        },
        className: SKILL_PROBABILITY[HEROES_NAMES.SNIPER],
        statusManager: true,
        actionRecord: true,
        callbacks: {
            beforeBattle: unoticedShot,
            afterBattle: (c: Character) => {
                c.skill.isUsed = false;
            },
        },
    });
};


const createSoldier = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[HEROES_NAMES.SOLDIER],
            isUsed: false,
        },
        className: SKILL_PROBABILITY[HEROES_NAMES.SOLDIER],
        statusManager: true,
        actionRecord: true,
        callbacks: {
            afterTurn: shieldGesture
        },
    });
};


const createThieve = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[HEROES_NAMES.THIEVE],
            isUsed: false,
        },
        className: SKILL_PROBABILITY[HEROES_NAMES.THIEVE],
        statusManager: true,
        actionRecord: true,
        callbacks: {
            receiveDamage: fervor,
        },
    });
};


export {
    createArcher,
    createBerserk,
    createDefender,
    createFencer,
    createNinja,
    createPaladin,
    createSniper,
    createSoldier,
    createThieve
}