import { Router } from "express";
import { createRandomHero } from '../controller/hero.controller'
const router = Router()

// '/hero'  added from app.
router.route('/random').get(
   createRandomHero
)

export default router;