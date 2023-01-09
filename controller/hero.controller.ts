import { Request, Response } from "express";
import { createHero } from "../functions/hero";

let createRandomHero = (req: Request, res: Response) => {
    //sacar por consola los parametros que se le pasan a la ruta
    console.log(req.query)
    console.log(req.params)
    res.send(createHero({
        ...req.query
    }))
}

export { createRandomHero };