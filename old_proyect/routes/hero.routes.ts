import { Router } from 'express';
import { createHeros, fight2heros } from '../controllers/hero.controller';

const router = Router();

//checked.
router.route('/create/:numberToCreate').get(createHeros);

router.route('/fight').get(fight2heros);

export default router;
