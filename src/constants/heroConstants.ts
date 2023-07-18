import { HeroStats } from "../types/heroModel";

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

const COMMON_STATS: Omit<HeroStats, 'idClass' | 'className'> = {
    "hp": 70,
    "attack": 10,
    "defence": 7,
    "crit": 0.1,
    "critMultiplier": 1,
    "accuracy": 0.9,
    "evasion": 0.1,
    "attackInterval": 12,
    "attackSpeed": 1,
    "reg": 0.6
};

const CLASSES_STATS = {
    [HEROES_NAMES.ARCHER]: {
        "idClass": 1,
        "className": HEROES_NAMES.ARCHER,
        "hp": 18,
        "attack": 13,
        "defence": -1,
        "crit": 0.3,
        "critMultiplier": 0.3,
        "accuracy": -0.05,
        "evasion": 0.24,
        "attackInterval": -5,
        "attackSpeed": 1,
        "reg": 0
    },
    [HEROES_NAMES.BERSERKER]: {
        "idClass": 2,
        "className": HEROES_NAMES.BERSERKER,
        "hp": 70,
        "attack": 25,
        "defence": -2,
        "crit": 0.05,
        "critMultiplier": 0,
        "accuracy": -0.05,
        "evasion": 0.05,
        "attackInterval": -1,
        "attackSpeed": 1,
        "reg": 0.2
    },
    [HEROES_NAMES.DEFENDER]: {
        "idClass": 3,
        "className": HEROES_NAMES.DEFENDER,
        "hp": 42,
        "attack": 6,
        "defence": 31,
        "crit": -0.1,
        "critMultiplier": 0,
        "accuracy": 0.04,
        "evasion": -0.05,
        "attackInterval": 3,
        "attackSpeed": 1,
        "reg": 0.2
    },
    [HEROES_NAMES.FENCER]: {
        "idClass": 4,
        "className": HEROES_NAMES.FENCER,
        "hp": 34,
        "attack": 16,
        "defence": 11,
        "crit": 0.1,
        "critMultiplier": 0,
        "accuracy": -0.05,
        "evasion": 0.1,
        "attackInterval": 0,
        "attackSpeed": 1,
        "reg": 0
    },
    [HEROES_NAMES.NINJA]: {
        "idClass": 5,
        "className": HEROES_NAMES.NINJA,
        "hp": -28,
        "attack": 14,
        "defence": -2,
        "crit": 0.4,
        "critMultiplier": 0.25,
        "accuracy": 0,
        "evasion": 0.33,
        "attackInterval": -2,
        "attackSpeed": 1,
        "reg": 0
    },
    [HEROES_NAMES.PALADIN]: {
        "idClass": 6,
        "className": HEROES_NAMES.PALADIN,
        "hp": 50,
        "attack": 19,
        "defence": 21,
        "crit": 0.1,
        "critMultiplier": 0,
        "accuracy": 0,
        "evasion": 0,
        "attackInterval": -1,
        "attackSpeed": 1,
        "reg": 0.2
    },
    [HEROES_NAMES.SNIPER]: {
        "idClass": 7,
        "className": HEROES_NAMES.SNIPER,
        "hp": 5,
        "attack": 33,
        "defence": -2,
        "crit": 0.7,
        "critMultiplier": 2.7,
        "accuracy": -0.6,
        "evasion": 0,
        "attackInterval": 14,
        "attackSpeed": 1,
        "reg": -0.2
    },
    [HEROES_NAMES.SOLDIER]: {
        "idClass": 8,
        "className": HEROES_NAMES.SOLDIER,
        "hp": 35,
        "attack": 21,
        "defence": 16,
        "crit": 0.2,
        "critMultiplier": 0.1,
        "accuracy": 0,
        "evasion": 0.1,
        "attackInterval": 0,
        "attackSpeed": 1,
        "reg": 0
    },
    [HEROES_NAMES.THIEVE]: {
        "idClass": 9,
        "className": HEROES_NAMES.THIEVE,
        "hp": 25,
        "attack": 14,
        "defence": 3,
        "crit": 0.42,
        "critMultiplier": 0.24,
        "accuracy": -0.19,
        "evasion": 0.22,
        "attackInterval": -1,
        "attackSpeed": 1,
        "reg": 0.3
    }
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

export {
    HEROES_NAMES,
    COMMON_STATS,
    CLASSES_STATS,
    SKILL_PROBABILITY,
};