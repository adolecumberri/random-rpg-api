import { Router } from 'express';
import { createCrewsByGender, asignCrewsToHero, getCrew } from '../controllers/crew.controller';

const router = Router();

router.route('/create').get(createCrewsByGender);

router.route('/asign').get(asignCrewsToHero);

router.route('/get/:id_crew').get(getCrew);

export default router;
