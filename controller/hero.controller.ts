import { Request, Response } from "express";
import { createHero } from "../functions/hero";
import { MESSAGES } from "../constants";
import { hero_with_class_stats } from "../interfaces/hero.interfaces";

let create_random_hero = (req: Request, res: Response) => {
    //sacar por consola los parametros que se le pasan a la ruta
    console.log(req.query)

    //early exit strategy
    if(req.query.number && Number(req.query.number) <= 0) res.sendStatus(400).send(MESSAGES.error.invalid_number_of_heroes_requested)

    //init solution
    let solution: hero_with_class_stats | hero_with_class_stats[] = []

    if(req.query.number) {
        //creates multiple heroes
        for(let i = 0; i < Number(req.query.number); i++) {
            solution.push( createHero({
                ...req.query
            }))
        }
    } else {
        //creates 1 hero
        solution = createHero({
            ...req.query
        })
    }

    res.json(solution)
}

export { create_random_hero };