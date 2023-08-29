import { CharacterCallbacks, Character } from "rpg-ts";
import { haste, rage, skipeShield, riposte, tripleAttack, holyLight, unoticedShot, shieldGesture, fervor } from "../../heroes/skills";
import { heroWithStatsFromTable, rowOfTableHeroes, rowOfTableStats } from "./mysqlStorageTypes";
import { HEROES_NAMES } from "../../constants";
import { Hero } from "../../types";

function restoreCharacter(storedHero: heroWithStatsFromTable, callbacks: CharacterCallbacks){

    let { stats, originalStats, ...storedHeroRest } = storedHero;

    
    let { skillProbability: sp, id: _idA, heroId: _hIdA, originalStats: _osA, ...restStats } = stats;
    let { skillProbability: _spB, id: _idB, heroId: _hIdB, originalStats: _osB, ...restOriginalStats } = originalStats;


    return new Character({
        name: storedHeroRest.name,
        surname: storedHeroRest.surname,
        gender: storedHeroRest.gender,
        skill: {
            probability: sp,
        },
        isAlive: storedHero.isAlive,
        id: storedHeroRest.characterId ,
        className: storedHeroRest.className,
        statusManager: true,
        actionRecord: true,
        callbacks,
        originalStats: {...restOriginalStats},
        stats: {...restStats}
    }) as Hero;
}

const restoreArcher = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        criticalAttack: haste,
        normalAttack: haste,
    });
}

const restoreBerserk = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        receiveDamage: rage,
    });
}

const restoreDefender = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterAnyDefence: skipeShield,
    });
}

const restoreFencer = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterAnyDefence: riposte,
    });
}

const restoreNinja = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterAnyAttack: tripleAttack,
    });
};

const restorePaladin = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterTurn: holyLight,
    });
};

const restoreSniper = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        beforeBattle: unoticedShot,
        afterBattle: (c: Character) => {
            c.skill.isUsed = false;
        },
    });
};

const restoreSoldier = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterTurn: shieldGesture,
    });
};

const restoreThieve = (storedHero: heroWithStatsFromTable) => {
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