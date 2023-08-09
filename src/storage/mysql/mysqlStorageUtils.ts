import { CharacterCallbacks, Character } from "rpg-ts";
import { haste, rage, skipeShield, riposte, tripleAttack, holyLight, unoticedShot, shieldGesture, fervor } from "../../heroes/skills";
import { rowOfTableHeroes } from "./mysqlStorageTypes";
import { HEROES_NAMES } from "../../constants";
import { Hero } from "../../types";

function restoreCharacter(storedHero: rowOfTableHeroes, callbacks: CharacterCallbacks){
    return new Character({
        name: storedHero.name,
        surname: storedHero.surname,
        gender: storedHero.gender,
        skill: {
            probability: storedHero.skillProbability,
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
    }) as Hero;
}

const restoreArcher = (storedHero: rowOfTableHeroes) => {
    return restoreCharacter(storedHero, {
        criticalAttack: haste,
        normalAttack: haste,
    });
}

const restoreBerserk = (storedHero: rowOfTableHeroes) => {
    return restoreCharacter(storedHero, {
        receiveDamage: rage,
    });
}

const restoreDefender = (storedHero: rowOfTableHeroes) => {
    return restoreCharacter(storedHero, {
        receiveDamage: skipeShield,
    });
}

const restoreFencer = (storedHero: rowOfTableHeroes) => {
    return restoreCharacter(storedHero, {
        afterAnyDefence: riposte,
    });
}

const restoreNinja = (storedHero: rowOfTableHeroes) => {
    return restoreCharacter(storedHero, {
        afterAnyAttack: tripleAttack,
    });
};

const restorePaladin = (storedHero: rowOfTableHeroes) => {
    return restoreCharacter(storedHero, {
        afterTurn: holyLight,
    });
};

const restoreSniper = (storedHero: rowOfTableHeroes) => {
    return restoreCharacter(storedHero, {
        beforeBattle: unoticedShot,
        afterBattle: (c: Character) => {
            c.skill.isUsed = false;
        },
    });
};

const restoreSoldier = (storedHero: rowOfTableHeroes) => {
    return restoreCharacter(storedHero, {
        afterTurn: shieldGesture,
    });
};

const restoreThieve = (storedHero: rowOfTableHeroes) => {
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
};

export {
    restoreHero,
}