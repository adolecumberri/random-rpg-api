import { Router } from 'express';
import { randomGroupFight } from '../controllers/groupFight.controller';


const router = Router();

router.route('/random/:groupSize').get(randomGroupFight);

export default router;
