import { Request, Response } from "express";
import { setHero } from '../functions/bbdd';
import { createHero } from "../functions/hero";



const create_random_hero_and_save_it = async (req: Request, res: Response) => {

    console.log(req.query)
    let hero_created = await createHero({
        ...req.query
    })

    setHero(hero_created)  //save hero in database
    
    res.send(hero_created) //Return hero created
}

export { create_random_hero_and_save_it }
