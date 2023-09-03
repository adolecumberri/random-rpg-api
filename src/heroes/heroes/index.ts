import { getRandomInt, Character, CharacterCallbacks, StatusManager, ActionRecord, LevelManager } from "rpg-ts";
import { getMaleName, getFemaleName, getSurname, getStatsByClassName, killedHeroCallback } from "../../helpers";
import { Hero, HeroIdentity } from "../../types";
import { HEROES_NAMES, LEVEL_MANAGER_DEFAULT, SKILL_PROBABILITY } from "../../constants";
import { fervor, haste, holyLight, rage, riposte, shieldGesture, skipeShield, tripleAttack, unoticedShot } from '../skills';

function createCharacter(
    className: keyof typeof HEROES_NAMES,
    options?: HeroIdentity,
    callbacks?: CharacterCallbacks
) {
    const genderRol = getRandomInt(0, 1)
    console.log
    let gender = options?.gender !== undefined ? options.gender : genderRol ? 'F' : 'M';
    let name = options?.name !== undefined ? options.name : (gender == 'F' ? getFemaleName() : getMaleName());
    let surname = options?.surname || getSurname();

    console.log(`${name} ${surname} (${gender} - ${genderRol}) has been created`)

    return new Character({
        name,
        surname,
        gender,
        title: '',
        kills: 0,
        defeats: 0,
        skill: {
            probability: SKILL_PROBABILITY[className],
        },
        className: className,
        statusManager: new StatusManager(),
        actionRecord: new ActionRecord(),
        levelManager: new LevelManager({
            ...LEVEL_MANAGER_DEFAULT
        }),
        callbacks,
        stats: getStatsByClassName(className),
    }) as Hero;
}

const createArcher = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.ARCHER, options, {
        criticalAttack: haste,
        normalAttack: haste,
        die: killedHeroCallback,
    });
}

const createBerserk = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.BERSERKER, options, {
        receiveDamage: rage,
        die: killedHeroCallback,
    });
}

const createDefender = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.DEFENDER, options, {
        afterAnyDefence: skipeShield,
        die: killedHeroCallback,
    });
}

const createFencer = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.FENCER, options, {
        afterAnyDefence: riposte,
        die: killedHeroCallback,
    });
}

const createNinja = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.NINJA, options, {
        afterAnyAttack: tripleAttack,
        die: killedHeroCallback,
    });
};

const createPaladin = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.PALADIN, options, {
        afterTurn: holyLight,
        die: killedHeroCallback,
    });
};

const createSniper = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.SNIPER, options, {
        beforeBattle: unoticedShot,
        afterBattle: (c: Character) => {
            c.skill.isUsed = false;
        },
        die: killedHeroCallback,
    });
};

const createSoldier = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.SOLDIER, options, {
        afterTurn: shieldGesture,
        die: killedHeroCallback,
    });
};

const createThieve = (options?: HeroIdentity) => {
    return createCharacter(HEROES_NAMES.THIEVE, options, {
        receiveDamage: fervor,
        die: killedHeroCallback,
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