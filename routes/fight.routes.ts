import { Router } from 'express';
import { randomGroupFight } from '../controllers/groupFight.controller';
import { fight1v1, fight1v1Random, fight1v1Recursive, fightToGenerateStats }from '../controllers/fight.controller';

const router = Router();

router.route('/random/:groupSize').get(randomGroupFight);

router.route('/1v1/random').get(fight1v1Random);

router.route('/1v1/:id1/:id2').get(fight1v1);
router.route('/1v1/recursive/:id1/:id2/:times').get(fight1v1Recursive);


router.route('/loadstats/:id1').get(fightToGenerateStats);

export default router;
