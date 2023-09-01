import { getRandomInt, Character, CharacterCallbacks, StatusManager, ActionRecord } from "rpg-ts";
import { getMaleName, getFemaleName, getSurname, getStatsByClassName } from "../../helpers";
import { Hero, HeroIdentity } from "../../types";
import { HEROES_NAMES, SKILL_PROBABILITY } from "../../constants";
import { fervor, haste, holyLight, rage, riposte, shieldGesture, skipeShield, tripleAttack, unoticedShot } from '../skills';
import { rowOfTableHeroes } from "../../storage/mysql/mysqlStorageTypes";

function createCharacter(
    className: keyof typeof HEROES_NAMES,
    options?: HeroIdentity,
    callbacks?: CharacterCallbacks
) {
    let gender = options?.gender !== undefined ? options.gender : getRandomInt(0, 1) ? 'F' : 'M';
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skill: {
            probability: SKILL_PROBABILITY[className],
        },
        className: className,
        statusManager: new StatusManager(),
        actionRecord: new ActionRecord(),
        levelManager: new LevelManager(),
        callbacks,
        stats: getStatsByClassName(className),
    }) as Hero;
}

const createArcher = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.ARCHER, options, {
        criticalAttack: haste,
        normalAttack: haste,
    });
}

const createBerserk = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.BERSERKER, options, {
        receiveDamage: rage,
    });
}

const createDefender = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.DEFENDER, options, {
        afterAnyDefence: skipeShield,
    });
}

const createFencer = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.FENCER, options, {
        afterAnyDefence: riposte,
    });
}

const createNinja = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.NINJA, options, {
        afterAnyAttack: tripleAttack,
    });
};

const createPaladin = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.PALADIN, options, {
        afterTurn: holyLight,
    });
};

const createSniper = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.SNIPER, options, {
        beforeBattle: unoticedShot,
        afterBattle: (c: Character) => {
            c.skill.isUsed = false;
        },
    });
};

const createSoldier = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.SOLDIER, options, {
        afterTurn: shieldGesture,
    });
};

const createThieve = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.THIEVE, options, {
        receiveDamage: fervor,
    });
};

const heroFactory = {
    [HEROES_NAMES.ARCHER]: createArcher,
    [HEROES_NAMES.BERSERKER]: createBerserk,
    [HEROES_NAMES.DEFENDER]: createDefender,
    [HEROES_NAMES.FENCER]: createFencer,
    [HEROES_NAMES.NINJA]: createNinja,
    [HEROES_NAMES.PALADIN]: createPaladin,
    [HEROES_NAMES.SNIPER]: createSniper,
    [HEROES_NAMES.SOLDIER]: createSoldier,
    [HEROES_NAMES.THIEVE]: createThieve,
}

export {
    heroFactory,
}