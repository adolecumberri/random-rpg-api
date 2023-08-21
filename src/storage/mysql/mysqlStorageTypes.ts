import { type } from "os";
import { Stats } from "rpg-ts";

type rowOfTableHeroes = {
    id: number;
    heroId: number;
    name: string;
    surname: string;
    gender: string;
    className: string;
    isAlive: boolean;
    level: number;
}

type rowOfTableStats = Stats & {
    skillProbability: number
    id: number;
    heroId: number;
    originalStats: number;

};

interface heroWithStatsFromTable {
    id: number;
    heroId: number;
    name: string;
    surname: string;
    gender: string;
    className: string;
    isAlive: boolean;
    level: number;
    stats: rowOfTableStats,
    originalStats: rowOfTableStats
  }


type rowOfTableteams = {
    id: number; 
    teamId: number; 
    name: string; 
    members: number;
}

type rowOfAttackRecord = {
    id: number;
    attackId: number;
    attackType: "NORMAL" | "MISS" | "CRITICAL" | "TRUE" | "SKILL";
    damage: number;
    characterId: number;
}

type rowOfDefenceRecord = {
    id: number;
    defenceId: number;
    defenceType: 'NORMAL' |'EVASION' | 'MISS' | 'TRUE' | 'SKILL';
    damageReceived: number;
    characterId: number;
    attackerId: number;
}

export {
    rowOfTableHeroes,
    rowOfTableteams,
    rowOfAttackRecord,
    rowOfDefenceRecord,
    rowOfTableStats,
    heroWithStatsFromTable
}

