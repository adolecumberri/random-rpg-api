// routes/heroRoutes.ts
import { Router } from 'express';
import { createHero } from '../controllers';
import { URL_CREATE } from '../constants';

const heroRouter = Router();

heroRouter.post(URL_CREATE, createHero);

export {
    heroRouter
};
