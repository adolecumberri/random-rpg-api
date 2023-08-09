import { AttackRecord, Character, DefenceRecord, Stats } from "rpg-ts";
import { HEROES_NAMES } from "../constants";

type HeroName = typeof HEROES_NAMES[keyof typeof HEROES_NAMES];

interface HeroIdentity {
    gender: string;
    name: string;
    surname: string;
} // opciones que se le pasa al crear el heroe.

type Hero = Character & HeroIdentity & {className: string}

export { 
    HeroName,
    HeroIdentity,
    Hero,
};