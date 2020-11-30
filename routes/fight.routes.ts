import { Router } from 'express';
import {
	fight1v1,
	fight1v1Random,
	fight1v1Recursive,
	fightToGenerateStats,
	fightOneClassVSAll,
	fightToGenerateStatsWithAllGroups,
	fight1v1ByClassId,
	createStatsRandomly,
} from '../controllers/fight.controller';
import { randomGroupFight } from '../controllers/groupFight.controller';

const router = Router();

router.route('/1v1/random').get(fight1v1Random);
router.route('/1v1/byClass/:id1/:id2').get(fight1v1ByClassId);

router.route('/1v1/:id1/:id2').get(fight1v1);
router.route('/1v1/recursive/:id1/:id2/:times').get(fight1v1Recursive);

router.route('/loadstats/:id1/:howmany').get(fightToGenerateStatsWithAllGroups);
router.route('/loadstats/:id1/:id2/:howmany').get(fightOneClassVSAll);

router.route('/random/:howmany').get(createStatsRandomly);

router.route('/group/random/:howmany').get(randomGroupFight)
export default router;
