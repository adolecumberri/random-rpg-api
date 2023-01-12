import { Request, Response } from "express";
import { MESSAGES } from "../constants";
import { setHero, setHeroes } from '../functions/bbdd';
import { createHero } from "../functions/hero";
import { hero_with_class_stats } from "../interfaces/hero.interfaces";

const create_random_hero_and_save_it = async (req: Request, res: Response) => {
    console.log('entro dentro de la funcion')
    if(req.query.number && Number(req.query.number) <= 0) res.sendStatus(400).send(MESSAGES.error.invalid_number_of_heroes_requested)

    //init solution
    let hero_created: hero_with_class_stats | hero_with_class_stats[] = []

    if(req.query.number) {
        //creates multiple heroes
        for(let i = 0; i < Number(req.query.number); i++) {
            hero_created.push( createHero({
                ...req.query
            }))
        }
        await setHeroes(hero_created)  //save hero in database
    } else {
        //creates 1 hero
        hero_created = createHero({
            ...req.query
        })
        await setHero(hero_created)  //save hero in database
    }

    res.json(hero_created) //Return hero created
}

export { create_random_hero_and_save_it }
