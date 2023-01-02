import { Request, Response } from "express";
import { createHero } from "../functions/hero";

let createRandomHero = (req: Request, res: Response) => {
    console.log(req.params)
    res.send(createHero({
        ...req.query
    }))
}

export { createRandomHero };