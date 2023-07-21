import { Character, Stats } from "rpg-ts";
import { HEROES_NAMES } from "../constants";

type HeroName = typeof HEROES_NAMES[keyof typeof HEROES_NAMES];

type RawHeroStats =  Omit<Stats, 'totalHp'> & {
    idClass?: number;
    className?: HeroName;
    reg: number;
}; // Stats de las clases sin procesar.

interface HeroIdentity {
    gender: number;
    name: string;
    surname: string;
} // opciones que se le pasa al crear el heroe.

interface StoredHero { 
    id: number, 
    isAlive: boolean, 
    name: string, 
    stats: Stats,  
    surname: string, 
    className: string,
    gender: number,
} // valores guardados en los modulos de storage.

type Hero = Character & HeroIdentity & {className: string}

export { 
    HeroName,
    RawHeroStats,
    HeroIdentity,
    StoredHero,
    Hero,
};