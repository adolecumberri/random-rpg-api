
// controllers/heroController.ts
import { Request, Response } from "express";
import { HEROES_NAMES } from "../constants";
import { heroFactory } from "../heroes/heroes";
import { HeroIdentity } from "../types";

const createHero = (req: Request, res: Response) => {
    const { className, options }: { className: keyof typeof HEROES_NAMES, options?: HeroIdentity } = req.body;

    let localClassName = className;
    // Verificar si el className es válido
    if (!(localClassName in HEROES_NAMES)) {
        //get random classname from HEROES_NAMES
        localClassName = Object.keys(HEROES_NAMES)[Math.floor(Math.random() * Object.keys(HEROES_NAMES).length)] as keyof typeof HEROES_NAMES;
    }

    console.log("localClassName", localClassName)

    // Crear el personaje usando la función correspondiente de heroFactory
    try {
        const createHeroFunc = heroFactory[localClassName];
        const character = createHeroFunc(options);

        // Suponiendo que el personaje tiene un método para convertirse en JSON
        return res.json(character);

    } catch (error) {
        console.log(error);
    }
};

export {
    createHero
}