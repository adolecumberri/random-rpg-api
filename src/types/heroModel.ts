import { Character } from "rpg-ts";
import { HEROES_NAMES } from "../constants";

type HeroName = typeof HEROES_NAMES[keyof typeof HEROES_NAMES];

interface HeroIdentity {
    gender: string;
    name: string;
    surname: string;
} // opciones que se le pasa al crear el heroe.

type Hero = Character & HeroIdentity & {
    className: string;
    kills: number;
    defeats: number;
    title: string;
}

interface requestHero {
    className: keyof typeof HEROES_NAMES; 
    options: HeroIdentity;
}

export { 
    HeroName,
    HeroIdentity,
    Hero,
    requestHero
};