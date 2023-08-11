import { Router, Request, Response } from 'express';
import { BATTLES_IDS_REQUESTED, HEROES_NAMES, HEROES_URL, TEAMS_URL } from '../constants';
import { createHero } from '../controllers';
import { HeroIdentity, requestHero } from '../types';

const battleRouter = Router();

/**
 * /api/battle/
 *      /teams/
 *          /
 *          /:id_a/:id_b
 *      /heroes/
 *          /
 *          /id_a/id_b
 */
battleRouter.post(`${TEAMS_URL}`, (req: Request, res: Response) => {
   
    res.send('battle teams /, canela.');
});

battleRouter.get(`${TEAMS_URL}${BATTLES_IDS_REQUESTED}`, (req: Request, res: Response) => {
   
    res.send(`battle teams /${req.params.idA}/${req.params.idB}, canela.`);
});

battleRouter.post(`${HEROES_URL}`, (req: Request<{}, {}, {heroA: requestHero , heroB: requestHero}>, res: Response) => {
    
    const { heroA, heroB } = req.body;
    const response = createHero(body.className, body.options);


    res.send('battle /, canela.');
});

battleRouter.get(`${HEROES_URL}${BATTLES_IDS_REQUESTED}`, (req: Request, res: Response) => {
   
    res.send(`battle heroes /${req.params.idA}/${req.params.idB}, canela.`);
});

export {
    battleRouter
}