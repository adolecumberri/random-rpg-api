import { Stats } from "rpg-ts";
import { HEROES_NAMES } from "../constants";

type HeroName = typeof HEROES_NAMES[keyof typeof HEROES_NAMES];

type RawHeroStats =  Omit<Stats, 'totalHp'> & {
    idClass?: number;
    className?: HeroName;
    reg: number;
}

interface HeroIdentity {
    gender?: number;
    name?: string;
    surname?: string;
}

interface StoredHero { 
    id: number, 
    isAlive: true, 
    name: string, 
    stats: Stats & {reg:number},  
    surname: string, 
    className: string,
    gender: number,
}


export { 
    HeroName,
    RawHeroStats,
    HeroIdentity,
    StoredHero,
};