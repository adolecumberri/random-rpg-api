// routes/heroRoutes.ts
import { Router, Request, Response } from 'express';
import { createHero, createHeroes } from '../controllers';
import { HEROES_NAMES, URL_CREATE, URL_CREATE_MULTIPLE, URL_RESTORE } from '../constants';
import { moduleHandler } from '../storage/storageConfguration';
import { Hero } from '../types';

const heroRouter = Router();

heroRouter.post(URL_CREATE, async (req: Request, res: Response) => {
    const body = req.body;
    const response = createHero(body.className, body.options);

    await moduleHandler.getModule().saveHero(response);
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

heroRouter.get(URL_RESTORE, async (req: Request, res: Response) => {
    const { id } = req.params;
    let response = null;
    try {
        response = await moduleHandler.getModule().restoreHeroById(Number(id));
    } catch (e: any) {
        res.status(404).json({ error: e.message });
    }
    res.json(response);
});



export {
    heroRouter
};
