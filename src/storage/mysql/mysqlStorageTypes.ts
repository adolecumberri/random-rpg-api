
type rowOfTableHeroes = {
    id: number;
    heroId: number;
    name: string;
    surname: string;
    gender: string;
    className: string;
    hp: number;
    totalHp: number;
    attack: number;
    defence: number;
    crit: number;
    critMultiplier: number;
    accuracy: number;
    evasion: number;
    attackInterval: number;
    regeneration: number;
    isAlive: number;
    skillProbability: number;
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
    rowOfDefenceRecord
}

