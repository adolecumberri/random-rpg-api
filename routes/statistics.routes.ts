
import { Router } from "express";
import {
    getHeroStats,
} from "../controllers/statistics.controller";

const router = Router();

router
  .route("")
  .get(getHeroStats);

export default router;
