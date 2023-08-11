import { Router, Request, Response } from 'express';
import { BATTLES_IDS_REQUESTED, HEROES_NAMES, HEROES_URL, TEAMS_URL } from '../constants';
import { createHero } from '../controllers';
import { HeroIdentity, requestHero } from '../types';
import { AttackRecord, Battle, DefenceRecord, Log, firstLog, lastLog } from 'rpg-ts';
import { moduleHandler } from '../storage/storageConfguration';

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

battleRouter.post(`${HEROES_URL}`, (req: Request<{}, {}, { heroA: requestHero | undefined, heroB: requestHero | undefined }>, res: Response) => {
    const { heroA, heroB } = req.body;
    const newHeroA = createHero(
        heroA ? heroA.className : undefined,
        heroA ? heroA.options : undefined
    );
    const newHeroB = createHero(
        heroB ? heroB.className : undefined,
        heroB ? heroB.options : undefined
    );

    let b = new Battle();
    b.setBattleType('INTERVAL_BASED');

    const solutionId = b.runBattle(newHeroA, newHeroB);

    const solution = {
        id: solutionId,
        logs: b.logs.get(solutionId),
        heroA: {
            name: newHeroA.name,
            surname: newHeroA.surname,
            gender: newHeroA.gender,
            className: newHeroA.className,
            stats: newHeroA.stats,
            attacks: newHeroA.actionRecord?.attacks!,
            defences: newHeroA.actionRecord?.defences!
        },
        heroB: {
            name: newHeroB.name,
            surname: newHeroB.surname,
            gender: newHeroB.gender,
            className: newHeroB.className,
            stats: newHeroB.stats,
            attacks: newHeroB.actionRecord?.attacks!,
            defences: newHeroB.actionRecord?.defences!
        }
    }

    res.json(solution);
});

battleRouter.get(`${HEROES_URL}${BATTLES_IDS_REQUESTED}`, async (req: Request, res: Response) => {
    const newHeroA = await moduleHandler.getModule().getHeroById(Number(req.params.idA));
    const newHeroB = await moduleHandler.getModule().getHeroById(Number(req.params.idB));

    if(!newHeroA) {
        res.status(404).json({ error: `Hero:${req.params.idA} not found.` });
        return;
    } 
    
    if(!newHeroB) {
        res.status(404).json({ error: `Hero:${req.params.idB} not found.` });
        return;
    }

    let b = new Battle();
    b.setBattleType('INTERVAL_BASED');

    const solutionId = b.runBattle(newHeroA, newHeroB);

    const solution = {
        id: solutionId,
        initialLog: b.logs.get(solutionId)?.initialLog,
        logs: b.logs.get(solutionId)?.logs,
        finalLog: b.logs.get(solutionId)?.finalLog,
        heroA: {
            name: newHeroA.name,
            surname: newHeroA.surname,
            gender: newHeroA.gender,
            className: newHeroA.className,
            stats: newHeroA.stats,
            attacks: newHeroA.actionRecord?.attacks!,
            defences: newHeroA.actionRecord?.defences!
        },
        heroB: {
            name: newHeroB.name,
            surname: newHeroB.surname,
            gender: newHeroB.gender,
            className: newHeroB.className,
            stats: newHeroB.stats,
            attacks: newHeroB.actionRecord?.attacks!,
            defences: newHeroB.actionRecord?.defences!
        }
    }



    res.json(solution);
});

export {
    battleRouter
}