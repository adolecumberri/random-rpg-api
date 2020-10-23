import { Router } from "express";
import {
    getRanHero,
    fightAsinc,
    fightWithTurns
} from "../controllers/hero.controller";

const router = Router();

router
  .route("")
  .get(getRanHero);

router.route("/fight2")
.get(fightWithTurns);

router.route("/fightTest")
.get(fightAsinc);

router.route("f/:id1")


export default router;
