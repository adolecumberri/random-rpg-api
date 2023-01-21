import { Router } from "express";
import { LogManager, SkillManager, StatusManager } from "rpg-ts";
import { create_random_hero_and_save_it } from "../controller/bbdd.controller";
import { create_random_hero } from '../controller/hero.controller'
import { createHero } from "../functions/hero";
import { archer } from "../functions/hero_type";
const router = Router()


router.route(
    '/save/random'
).get(
    create_random_hero_and_save_it
)

router.route('/random').get(
    create_random_hero
)

router.route('/something').get(
    (req, res) => {
        console.log(archer)
        let hero = createHero({
            ...req.query
        })
        archer.name = hero.name
        archer.surname = hero.surname
        archer.stats = hero;

        res.send( archer )
    }
)

export default router;