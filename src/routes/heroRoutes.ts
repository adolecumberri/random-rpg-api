// routes/heroRoutes.ts
import { Router } from 'express';
import { createHero } from '../controllers/heroController';

const heroRouter = Router();

heroRouter.post('/create', createHero);

export {
    heroRouter
};
