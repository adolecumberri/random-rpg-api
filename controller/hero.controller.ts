import { Request, Response } from "express";
import { createHero } from "../functions/hero";

let createRandomHero = (req: Request, res: Response) => {


    createHero()


    res.send(createHero())
}

export { createRandomHero };