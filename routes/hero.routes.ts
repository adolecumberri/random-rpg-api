import { Router } from "express";
import { setHero } from "../controller/bbdd.controller";
import { createRandomHero } from '../controller/hero.controller'
import { createHero } from "../functions/hero";
const router = Router()


router.route([
    '/save/random?gender=:gender&heroClass=:heroClass',
    '/save/random?heroClass=:heroClass',
    '/save/random?gender=:gender',
    '/save/random',
]).get(
    (req, res) => {
        
        console.log(req.query)
        let hero_created = createHero({
            ...req.query
        })

        //guardar hero_created con la funcion setHero
        setHero(hero_created)  
        
        res.send(hero_created)
    }
)


// '/hero'  added from app.
router.route([
    '/random?gender=:gender&heroClass=:heroClass',
    '/random?heroClass=:heroClass',
    '/random?gender=:gender',
    '/random/'
]).get(
   createRandomHero
)

export default router;