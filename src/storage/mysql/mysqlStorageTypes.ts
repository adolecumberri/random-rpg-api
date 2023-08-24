import { type } from "os";
import { Stats } from "rpg-ts";

type rowOfTableHeroes = {
    id: number;
    characterId: number;
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

interface heroWithStatsFromTable { // rowOfTableHeroes values...
    id: number;
    characterId: number;
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
    attackrecordId: number;
    attackType: "NORMAL" | "MISS" | "CRITICAL" | "TRUE" | "SKILL";
    damage: number;
    damageDealt: number;
    characterId: number;
}

type rowOfDefenceRecord = {
    id: number;
    defencerecordId: number;
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

