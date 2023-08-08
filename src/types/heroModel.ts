import { AttackRecord, Character, DefenceRecord, Stats } from "rpg-ts";
import { HEROES_NAMES } from "../constants";

type HeroName = typeof HEROES_NAMES[keyof typeof HEROES_NAMES];

interface HeroIdentity {
    gender: string;
    name: string;
    surname: string;
} // opciones que se le pasa al crear el heroe.

interface StoredHero { 
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
    isAlive: boolean;
    actionRecordAttacks: AttackRecord[];
    actionRecordDefences: DefenceRecord[];
} // valores guardados en los modulos de storage.

type Hero = Character & HeroIdentity & {className: string}

export { 
    HeroName,
    HeroIdentity,
    StoredHero,
    Hero,
};