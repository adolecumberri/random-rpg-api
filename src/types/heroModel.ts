import { HEROES_NAMES } from "../constants";

type HeroName = typeof HEROES_NAMES[keyof typeof HEROES_NAMES];

type HeroStats =  {
    idClass?: number;
    className?: HeroName;
    hp: number;
    attack: number;
    defence: number;
    crit: number;
    critMultiplier: number;
    accuracy: number;
    evasion: number;
    attackInterval: number;
    attackSpeed: number;
    reg: number;
}

interface HeroOptions {
    gender?: number;
    name?: string;
    surname?: string;
}


export { 
    HeroName,
    HeroStats,
    HeroOptions
};