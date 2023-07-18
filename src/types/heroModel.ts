import { Stats } from "rpg-ts";
import { HEROES_NAMES } from "../constants";

type HeroName = typeof HEROES_NAMES[keyof typeof HEROES_NAMES];

type HeroStats =  Omit<Stats, 'totalHp'> & {
    idClass?: number;
    className?: HeroName;
    reg: number;
}

interface HeroIdentity {
    gender?: number;
    name?: string;
    surname?: string;
}


export { 
    HeroName,
    HeroStats,
    HeroIdentity
};