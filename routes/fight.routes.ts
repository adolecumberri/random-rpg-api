import { Router } from 'express';
import { randomGroupFight } from '../controllers/groupFight.controller';
import {fight1v1}from '../controllers/fight.controller';

const router = Router();

router.route('/random/:groupSize').get(randomGroupFight);

router.route('/1v1/random').get(fight1v1);

export default router;
