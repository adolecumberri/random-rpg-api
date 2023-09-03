import { CharacterCallbacks, Character, Status, StatusManager, ActionRecord, LevelManager } from "rpg-ts";
import { haste, rage, skipeShield, riposte, tripleAttack, holyLight, unoticedShot, shieldGesture, fervor } from "../../heroes/skills";
import { heroWithStatsFromTable, rowOfTableHeroes, rowOfTableStats } from "./mysqlStorageTypes";
import { HEROES_NAMES, LEVEL_MANAGER_DEFAULT } from "../../constants";
import { Hero } from "../../types";
import { killedHeroCallback } from "../../helpers";

function restoreCharacter(storedHero: heroWithStatsFromTable, callbacks: CharacterCallbacks){

    let { stats, originalStats, ...storedHeroRest } = storedHero;

    
    let { skillProbability: sp, id: _idA, heroId: _hIdA, originalStats: _osA, ...restStats } = stats;
    let { skillProbability: _spB, id: _idB, heroId: _hIdB, originalStats: _osB, ...restOriginalStats } = originalStats;


    return new Character({
        name: storedHeroRest.name,
        surname: storedHeroRest.surname,
        gender: storedHeroRest.gender,
        title: storedHero.title,
        kills: storedHero.kills,
        defeats: storedHero.defeats,
        skill: {
            probability: sp,
        },
        isAlive: storedHero.isAlive,
        id: storedHeroRest.characterId ,
        className: storedHeroRest.className,
        statusManager: new StatusManager(),
        actionRecord: new ActionRecord(),
        levelManager: new LevelManager({
            ...LEVEL_MANAGER_DEFAULT,
            currentLevel: storedHeroRest.currentLevel,
            experience: storedHeroRest.experience,
        }),
        callbacks,
        originalStats: {...restOriginalStats},
        stats: {...restStats}
    }) as Hero;
}

const restoreArcher = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        criticalAttack: haste,
        normalAttack: haste,
        die: killedHeroCallback,
    });
}

const restoreBerserk = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        receiveDamage: rage,
        die: killedHeroCallback,
    });
}

const restoreDefender = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterAnyDefence: skipeShield,
        die: killedHeroCallback,
    });
}

const restoreFencer = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterAnyDefence: riposte,
        die: killedHeroCallback,
    });
}

const restoreNinja = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterAnyAttack: tripleAttack,
        die: killedHeroCallback,
    });
};

const restorePaladin = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterTurn: holyLight,
        die: killedHeroCallback,
    });
};

const restoreSniper = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        beforeBattle: unoticedShot,
        afterBattle: (c: Character) => {
            c.skill.isUsed = false;
        },
        die: killedHeroCallback,
    });
};

const restoreSoldier = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        afterTurn: shieldGesture,
        die: killedHeroCallback,
    });
};

const restoreThieve = (storedHero: heroWithStatsFromTable) => {
    return restoreCharacter(storedHero, {
        receiveDamage: fervor,
        die: killedHeroCallback,
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