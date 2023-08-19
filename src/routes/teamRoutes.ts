// routes/heroRoutes.ts
import { Router, Request, Response } from 'express';
import { createTeam } from '../controllers';
import { URL_CREATE, URL_RESTORE } from '../constants';
import { moduleHandler } from '../storage/storageConfguration';
import { teamReqBody, parsedHeroTypes } from '../types';

const teamRouter = Router();

teamRouter.post(URL_CREATE, async (req: Request<{}, {}, teamReqBody>, res: Response) => {
    let { name = "team", totalHeroes = 1, heroTypes = '{}' } = req.body;

    let parsedHeroTypes: parsedHeroTypes;
    try {
        parsedHeroTypes = JSON.parse(heroTypes);
    } catch (error) {
        return res.status(400).json({ error: 'Wrong JSON format for heroTypes' });
    }
    totalHeroes = Number(totalHeroes);
    let teamCreated = createTeam(name, totalHeroes, parsedHeroTypes);

    try {

        await moduleHandler.getModule().saveTeam(teamCreated);

        res.json(teamCreated);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

teamRouter.get(URL_RESTORE, async (req: Request, res: Response) => {
    const { id } = req.params;
    let response = null;
    try {
        response = await moduleHandler.getModule().getTeamById(Number(id));
    } catch (e: any) {
        res.status(404).json({ error: e.message });
    }
    res.json(response);
});

export {
    teamRouter
};
