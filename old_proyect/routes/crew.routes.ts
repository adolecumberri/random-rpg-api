import { Router } from 'express';
import { createCrewsByGender, asignCrewsToHerBySurname, getCrew } from '../controllers/crew.controller';

const router = Router();

//Aquí tendría que haber un middleware que segun el tipo de evento, llamara a una funcion para crear crews.
//checked. 306 families.
router.route('/create/eventtype=:eventType').get(createCrewsByGender);

router.route('/asign/event=:event').get(asignCrewsToHerBySurname);

router.route('/get/:id_crew').get(getCrew);

export default router;
