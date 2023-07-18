// routes/heroRoutes.ts
import { Router, Request, Response } from 'express';
import { createHero, createHeroes } from '../controllers';
import { HEROES_NAMES, URL_CREATE, URL_CREATE_MULTIPLE } from '../constants';

const heroRouter = Router();

heroRouter.post(URL_CREATE, (req: Request, res: Response) => {
    const body = req.body;
    const response = createHero(body.className, body.options);
    res.json(response);
});
heroRouter.post(URL_CREATE_MULTIPLE, (req: Request, res: Response) => {
    let { totalHeroes, heroTypes } = req.body;

    const parsedHeroTypes: { [x in keyof typeof HEROES_NAMES]?: number } = JSON.parse(heroTypes);
    totalHeroes = Number(totalHeroes);

    try {
        res.json(createHeroes(totalHeroes, parsedHeroTypes));
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

export {
    heroRouter
};
