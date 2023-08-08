// routes/heroRoutes.ts
import { Router, Request, Response } from 'express';
import { createTeam } from '../controllers';
import { HEROES_NAMES, URL_CREATE, URL_RESTORE } from '../constants';
import { moduleHandler } from '../storage/storageConfguration';

const teamRouter = Router();

teamRouter.post(URL_CREATE, async (req: Request, res: Response) => {
    let { name, totalHeroes, heroTypes } = req.body;

    const parsedHeroTypes: { [x in keyof typeof HEROES_NAMES]?: number } = JSON.parse(heroTypes);
    totalHeroes = Number(totalHeroes);

     try {
        let teamCreated = createTeam(name, totalHeroes, parsedHeroTypes);

        moduleHandler.getModule().saveTeam(teamCreated);

        res.json(teamCreated);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});



teamRouter.get(URL_RESTORE, async (req: Request, res: Response) => {
    // const { id } = req.params;
    // let response = null;
    // try {
    //     response = await moduleHandler.getModule().restoreCharacterById(Number(id));
    // } catch (e: any) {
    //     res.status(404).json({ error: e.message });
    // }
    // res.json(response);
});



export {
    teamRouter
};
