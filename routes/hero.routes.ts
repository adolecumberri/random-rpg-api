import { Router } from 'express';
import { createHeros, fight2heros } from '../controllers/hero.controller';

const router = Router();

router.route('/create/:numberToCreate').get(createHeros);

router.route('/fight').get(fight2heros);
// router.route("/fight2")
// .get(fightWithTurns);

// router.route("/fightTest")
// .get(fightAsinc);

// router.route("f/:id1")

export default router;
