import { getRandomInt, Character, CharacterCallbacks } from "rpg-ts";
import { getMaleName, getFemaleName, getSurname, getStatsByClassName } from "../../helpers";
import { Hero, HeroIdentity, StoredHero } from "../../types";
import { HEROES_NAMES, SKILL_PROBABILITY } from "../../constants";
import { fervor, haste, holyLight, rage, riposte, shieldGesture, skipeShield, tripleAttack, unoticedShot } from '../skills';

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
        statusManager: true,
        actionRecord: true,
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
        receiveDamage: skipeShield,
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


function restoreCharacter(storedHero: StoredHero, callbacks: CharacterCallbacks){
    return new Character({
        name: storedHero.name,
        surname: storedHero.surname,
        gender: storedHero.gender,
        skill: {
            probability: SKILL_PROBABILITY[storedHero.className as keyof typeof HEROES_NAMES],
        },
        isAlive: storedHero.isAlive,
        id: storedHero.heroId,
        className: storedHero.className,
        statusManager: true,
        actionRecord: true,
        callbacks,
        stats: {
            hp: storedHero.hp,
            totalHp: storedHero.totalHp,
            attack: storedHero.attack,
            defence: storedHero.defence,
            crit: storedHero.crit,
            critMultiplier: storedHero.critMultiplier,
            accuracy: storedHero.accuracy,
            evasion: storedHero.evasion,
            attackInterval: storedHero.attackInterval,
            regeneration: storedHero.regeneration,
        },
    });
}

const restoreArcher = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        criticalAttack: haste,
        normalAttack: haste,
    });
}

const restoreBerserk = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        receiveDamage: rage,
    });
}

const restoreDefender = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        receiveDamage: skipeShield,
    });
}

const restoreFencer = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        afterAnyDefence: riposte,
    });
}

const restoreNinja = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        afterAnyAttack: tripleAttack,
    });
};

const restorePaladin = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        afterTurn: holyLight,
    });
};

const restoreSniper = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        beforeBattle: unoticedShot,
        afterBattle: (c: Character) => {
            c.skill.isUsed = false;
        },
    });
};

const restoreSoldier = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        afterTurn: shieldGesture,
    });
};

const restoreThieve = (storedHero: StoredHero) => {
    return restoreCharacter(storedHero, {
        receiveDamage: fervor,
    });
};

const restoreHero = {
    [HEROES_NAMES.ARCHER]: restoreArcher,
    [HEROES_NAMES.BERSERKER]: restoreBerserk,
    [HEROES_NAMES.DEFENDER]: restoreDefender,
    [HEROES_NAMES.FENCER]: restoreFencer,
    [HEROES_NAMES.NINJA]: restoreNinja,
    [HEROES_NAMES.PALADIN]: restorePaladin,
    [HEROES_NAMES.SNIPER]: restoreSniper,
    [HEROES_NAMES.SOLDIER]: restoreSoldier,
    [HEROES_NAMES.THIEVE]: restoreThieve,
}

export {
    heroFactory,
    restoreHero, //this will recreate him from data stored in some moduless.
}