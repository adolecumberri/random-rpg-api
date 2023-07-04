import { HeroStats } from "../types/heroModel";

const HEROES_NAMES = {
    ARCHER: 'Archer',
    BERSERKER: 'Berserker',
    DEFENDER: 'Defender',
    FENCER: 'Fencer',
    NINJA: 'Ninja',
    PALADIN: 'Paladin',
    SNIPER: 'Sniper',
    SOLDIER: 'Soldier',
    THIEVE: 'Thieve',
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

const CLASSES_STATS: {[x: number]: HeroStats} = {
    1: {
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
    2: {
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
    3: {
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
    4: {
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
    5: {
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
    6: {
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
    7: {
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
    8: {
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
    9: {
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

const ARCHER_SKILL_PROBABILITY = 0.23;

export { 
    HEROES_NAMES,
    COMMON_STATS,
    CLASSES_STATS,
    ARCHER_SKILL_PROBABILITY,
 };