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

    try {
        teamA = JSON.parse(teamA as unknown as string) as any; 
        teamB = JSON.parse(teamB as unknown as string) as any;
    } catch (error) {
        return res.status(400).json({ error: `Wrong JSON format for teams: ${teamA} and ${teamB}` });
    }

    const defaultTeam = {
        name: "team",
        totalHeroes: 1,
        heroTypes: '{}'
    };

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

    console.log({
        members: teamBCreated.members.length,
        totalHeroesB
    })

    // Battle.
    let b = new Battle();
    b.setBattleType('INTERVAL_BASED');
    const solutionId = b.runBattle(teamACreated, teamBCreated);

    await moduleHandler.getModule().saveBattleTeams(solutionId, b, teamACreated, teamBCreated);

    console.log({
        getLast: JSON.stringify(teamACreated.getLastFightRecord()),
        getEvery: JSON.stringify(teamACreated.getEveryFightRecord()),
        getOneLast: JSON.stringify(teamACreated.getLastFightRecord()[teamACreated.members[0].id]),
        getOneEvery: JSON.stringify(teamACreated.getEveryFightRecord()[teamACreated.members[0].id]),
    })
    res.json({
        solutionId,
        initialLog: b.logs.get(solutionId)?.initialLog,
        logs: b.logs.get(solutionId)?.logs,
        finalLog: b.logs.get(solutionId)?.finalLog,
        teamA: {
            id: teamACreated.id,
            name: teamACreated.name,
            members: teamACreated.members.length,
            dead: teamACreated.getDeadMembers(),
            alive: teamACreated.getAliveMembers(),
            everyFightRecord: teamACreated.everyFightRecord,
            lastFightRecord: teamACreated.lastFightRecord
        },
        teamB: {
            id: teamBCreated.id,
            name: teamBCreated.name,
            members: teamBCreated.members.length,
            dead: teamBCreated.getDeadMembers(),
            alive: teamBCreated.getAliveMembers(),
            everyFightRecord: teamBCreated.everyFightRecord,
            lastFightRecord: teamBCreated.lastFightRecord
        }
    });
});

battleRouter.get(`${TEAMS_URL}${BATTLES_IDS_REQUESTED}`, async (req: Request, res: Response) => {

    if(!req.params.idA || !req.params.idB){
        res.status(400).json({ error: `Missing idA or idB` });
        return;
    }

    const teamA = await moduleHandler.getModule().getTeamById(Number(req.params.idA));
    const teamB = await moduleHandler.getModule().getTeamById(Number(req.params.idB));

    console.log({
        teamA,
        teamB
    })

    if (!teamA) {
        res.status(404).json({ error: `Hero:${req.params.idA} not found.` });
        return;
    }

    if (!teamB) {
        res.status(404).json({ error: `Hero:${req.params.idB} not found.` });
        return;
    }

    let b = new Battle();
    b.setBattleType('INTERVAL_BASED');

    const solutionId = b.runBattle(teamA, teamB);

    res.json({
        solutionId,
        initialLog: b.logs.get(solutionId)?.initialLog,
        logs: b.logs.get(solutionId)?.logs,
        finalLog: b.logs.get(solutionId)?.finalLog,
        teamA: {
            id: teamA.id,
            name: teamA.name,
            members: teamA.members.length,
            dead: teamA.getDeadMembers(),
            alive: teamA.getAliveMembers(),
            everyFightRecord: teamA.everyFightRecord,
            lastFightRecord: teamA.lastFightRecord
        },
        teamB: {
            id: teamB.id,
            name: teamB.name,
            members: teamB.members.length,
            dead: teamB.getDeadMembers(),
            alive: teamB.getAliveMembers(),
            everyFightRecord: teamB.everyFightRecord,
            lastFightRecord: teamB.lastFightRecord
        }
    });
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

    res.json(solution);
});

battleRouter.get(`${HEROES_URL}${BATTLES_IDS_REQUESTED}`, async (req: Request, res: Response) => {
    if(!req.params.idA || !req.params.idB){
        res.status(400).json({ error: `Missing idA or idB` });
        return;
    }

    const newHeroA = await moduleHandler.getModule().getHeroById(Number(req.params.idA));
    const newHeroB = await moduleHandler.getModule().getHeroById(Number(req.params.idB));

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