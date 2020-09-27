import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory
} from "../controllers/categories.controller";

const router = Router();

router
  .route("")
  .get(getCategories)
  .post(addCategory);

router
  .route("/:id_category")
  .get(getCategory)
  .delete(deleteCategory)
  .put(updateCategory);

export default router;
