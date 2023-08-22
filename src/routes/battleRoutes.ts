import { Router, Request, Response } from 'express';
import { BATTLES_IDS_REQUESTED, HEROES_URL, TEAMS_URL } from '../constants';
import { createHero, createTeam } from '../controllers';
import { requestHero, teamReqBody, parsedHeroTypes } from '../types';
import { Battle } from 'rpg-ts';
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
battleRouter.post(`${TEAMS_URL}`, async (req: Request<{}, {}, { teamA: teamReqBody, teamB: teamReqBody }>, res: Response) => {
    let { teamA, teamB } = req.body;

    const defaultTeam = {
        name: "team",
        totalHeroes: 1,
        heroTypes: '{}'
    }

    // Team A
    let nameA = teamA?.name || defaultTeam.name;
    let totalHeroesA = teamA?.totalHeroes || defaultTeam.totalHeroes;
    let heroTypesA: string | parsedHeroTypes = teamA?.heroTypes || defaultTeam.heroTypes;

    try {
        heroTypesA = JSON.parse(heroTypesA) as parsedHeroTypes;
    } catch (error) {
        return res.status(400).json({ error });
    }
    totalHeroesA = Number(totalHeroesA);
    let teamACreated = createTeam(nameA, totalHeroesA, heroTypesA);

    // Team B
    let nameB = teamB?.name || defaultTeam.name;
    let totalHeroesB = teamB?.totalHeroes || defaultTeam.totalHeroes;
    let heroTypesB: string | parsedHeroTypes = teamB?.heroTypes || defaultTeam.heroTypes;

    try {
        heroTypesB = JSON.parse(heroTypesB) as parsedHeroTypes;
    } catch (error) {
        return res.status(400).json({ error: 'Wrong JSON format for heroTypes' });
    }
    totalHeroesB = Number(totalHeroesB);
    let teamBCreated = createTeam(nameB, totalHeroesB, heroTypesB);

    // Battle.
    let b = new Battle();
    b.setBattleType('INTERVAL_BASED');
    const battleId = b.runBattle(teamACreated, teamBCreated);

    await moduleHandler.getModule().saveBattleTeams(battleId, b, teamACreated, teamBCreated);

    res.json(battleId);
});

battleRouter.get(`${TEAMS_URL}${BATTLES_IDS_REQUESTED}`, (req: Request, res: Response) => {

    res.send(`battle teams /${req.params.idA}/${req.params.idB}, canela.`);
});

battleRouter.post(`${HEROES_URL}`, async (req: Request<{}, {}, { heroA: requestHero | undefined, heroB: requestHero | undefined }>, res: Response) => {
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
            id: newHeroA.id,
            name: newHeroA.name,
            surname: newHeroA.surname,
            gender: newHeroA.gender,
            className: newHeroA.className,
            stats: newHeroA.stats,
            attacks: newHeroA.actionRecord?.attacks!,
            defences: newHeroA.actionRecord?.defences!
        },
        heroB: {
            id: newHeroB.id,
            name: newHeroB.name,
            surname: newHeroB.surname,
            gender: newHeroB.gender,
            className: newHeroB.className,
            stats: newHeroB.stats,
            attacks: newHeroB.actionRecord?.attacks!,
            defences: newHeroB.actionRecord?.defences!
        }
    }

    await moduleHandler.getModule().saveBattleHeroes(solutionId, b, newHeroA, newHeroB, false);
debugger;
    res.json({
        rawLogs: b.logs.size,
        battleId: solutionId,
        theoricalGoodLogs: b.logs.get(solutionId)?.logs,
    });
});

battleRouter.get(`${HEROES_URL}${BATTLES_IDS_REQUESTED}`, async (req: Request, res: Response) => {
    const newHeroA = await moduleHandler.getModule().getHeroById(Number(req.params.idA));
    const newHeroB = await moduleHandler.getModule().getHeroById(Number(req.params.idB));

    console.log({
        newHeroA,
        newHeroB
    })

    if (!newHeroA) {
        res.status(404).json({ error: `Hero:${req.params.idA} not found.` });
        return;
    }

    if (!newHeroB) {
        res.status(404).json({ error: `Hero:${req.params.idB} not found.` });
        return;
    }

    let b = new Battle();
    b.setBattleType('INTERVAL_BASED');

    const solutionId = b.runBattle(newHeroA, newHeroB);

    

    await moduleHandler.getModule().saveBattleHeroes(solutionId, b, newHeroA, newHeroB, true);
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