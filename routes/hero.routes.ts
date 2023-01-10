import { Router } from "express";
import { create_random_hero_and_save_it } from "../controller/bbdd.controller";
import { create_random_hero } from '../controller/hero.controller'
const router = Router()


router.route([
    '/save/random',
]).get(
    create_random_hero_and_save_it
)

router.route('/random').get(
    create_random_hero
)

export default router;