import { Router } from 'express';
import { createCrewsByGender, asignCrewsToHerBySurname, getCrew } from '../controllers/crew.controller';

const router = Router();

router.route('/create/eventtype=:eventType').get(createCrewsByGender);

router.route('/asign/event=:event').get(asignCrewsToHerBySurname);

router.route('/get/:id_crew').get(getCrew);

export default router;
