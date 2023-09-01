import { LevelManager, Stats } from "rpg-ts";

const HEROES_NAMES = {
    ARCHER: 'ARCHER',
    BERSERKER: 'BERSERKER',
    DEFENDER: 'DEFENDER',
    FENCER: 'FENCER',
    NINJA: 'NINJA',
    PALADIN: 'PALADIN',
    SNIPER: 'SNIPER',
    SOLDIER: 'SOLDIER',
    THIEVE: 'THIEVE',
} as const;

const COMMON_STATS: Stats = {
    "hp": 70,
    "totalHp": 70,
    "attack": 10,
    "defence": 7,
    "crit": 10,
    "critMultiplier": 0,
    "accuracy": 90,
    "evasion": 10,
    "attackInterval": 12,
    "attackSpeed": 0,
    "regeneration": 60
};

const CLASSES_STATS: {
    [x in keyof typeof HEROES_NAMES]: Stats
  } = {
    [HEROES_NAMES.ARCHER]: {
      hp: 18,
      totalHp: 18,
      attack: 13,
      defence: -1,
      crit: 30,
      critMultiplier: 30,
      accuracy: -5,
      evasion: 24,
      attackInterval: -5,
      attackSpeed: 1,
      regeneration: 0,
    },
    [HEROES_NAMES.BERSERKER]: {
      hp: 70,
      totalHp: 70,
      attack: 25,
      defence: -2,
      crit: 5,
      critMultiplier: 0,
      accuracy: -5,
      evasion: 5,
      attackInterval: -1,
      attackSpeed: 1,
      regeneration: 20,
    },
    [HEROES_NAMES.DEFENDER]: {
      hp: 42,
      totalHp: 42,
      attack: 6,
      defence: 31,
      crit: -10,
      critMultiplier: 0,
      accuracy: 4,
      evasion: -5,
      attackInterval: 3,
      attackSpeed: 1,
      regeneration: 20,
    },
    [HEROES_NAMES.FENCER]: {
      hp: 34,
      totalHp: 34,
      attack: 16,
      defence: 11,
      crit: 10,
      critMultiplier: 0,
      accuracy: -5,
      evasion: 10,
      attackInterval: 0,
      attackSpeed: 1,
      regeneration: 0,
    },
    [HEROES_NAMES.NINJA]: {
      hp: -28,
      totalHp:-28,
      attack: 14,
      defence: -2,
      crit: 40,
      critMultiplier: 25,
      accuracy: 0,
      evasion: 33,
      attackInterval: -2,
      attackSpeed: 1,
      regeneration: 0,
    },
    [HEROES_NAMES.PALADIN]: {
      hp: 50,
      totalHp: 50,
      attack: 19,
      defence: 21,
      crit: 10,
      critMultiplier: 0,
      accuracy: 0,
      evasion: 0,
      attackInterval: -1,
      attackSpeed: 1,
      regeneration: 20,
    },
    [HEROES_NAMES.SNIPER]: {
      hp: 5,
      totalHp: 5,
      attack: 33,
      defence: -2,
      crit: 70,
      critMultiplier: 270,
      accuracy: -60,
      evasion: 0,
      attackInterval: 14,
      attackSpeed: 1,
      regeneration: -20,
    },
    [HEROES_NAMES.SOLDIER]: {
      hp: 35,
      totalHp: 35,
      attack: 21,
      defence: 16,
      crit: 20,
      critMultiplier: 10,
      accuracy: 0,
      evasion: 10,
      attackInterval: 0,
      attackSpeed: 1,
      regeneration: 0,
    },
    [HEROES_NAMES.THIEVE]: {
      hp: 25,
      totalHp: 25,
      attack: 14,
      defence: 3,
      crit: 42,
      critMultiplier: 24,
      accuracy: -19,
      evasion: 22,
      attackInterval: -1,
      attackSpeed: 1,
      regeneration: 30,
    },
  };

const SKILL_PROBABILITY = {
    [HEROES_NAMES.ARCHER]: 23,
    [HEROES_NAMES.BERSERKER]: 100,
    [HEROES_NAMES.DEFENDER]: 100,
    [HEROES_NAMES.FENCER]: 22,
    [HEROES_NAMES.NINJA]: 19,
    [HEROES_NAMES.PALADIN]: 100,
    [HEROES_NAMES.SNIPER]: 75,
    [HEROES_NAMES.SOLDIER]: 23,
    [HEROES_NAMES.THIEVE]: 60,
} as const;

const LEVEL_MANAGER_DEFAULT: {[x in keyof LevelManager]?: LevelManager[x]} = {
    currentLevel: 1,
    experience: 0,
    maxLevel: 15,
    xpNeededFunction: (level: number) => Math.floor(3 + (level - 1)*2),
    xpGivenFunction: (level: number) => level,
    statsProgression: {
        hp: {
            type: 'BUFF_FIXED',
            value: 10,
        },
        attack: {
            type: 'BUFF_FIXED',
            value: 2,
        },
        defence: {
            type: 'BUFF_FIXED',
            value: 1,
        },
        crit: { 
            type: 'BUFF_FIXED',
            value: 1,
        },
    },
    levelUpCallbacks: {},
}

export {
    HEROES_NAMES,
    COMMON_STATS,
    CLASSES_STATS,
    SKILL_PROBABILITY,
    LEVEL_MANAGER_DEFAULT
};