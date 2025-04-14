import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from "../controllers/Categories.Controller";
import { authenticate } from "../middlewares/Auth.Middleware";
import { validateReqSchema } from "../middlewares/validator";
import {
  categoryIdParamSchema,
  createCategorySchema,
  listCategoriesQuerySchema,
  updateCategorySchema,
} from "../schemas/Categories.Schema";
import { handleRequest } from "../utils/requestHandler";

const router = express();

router.get(
  "/:id",
  authenticate,
  validateReqSchema(categoryIdParamSchema),
  handleRequest(getCategoryById)
);
router.get(
  "/",
  authenticate,
  validateReqSchema(listCategoriesQuerySchema),
  handleRequest(listCategories)
);
router.post(
  "/",
  authenticate,
  validateReqSchema(createCategorySchema),
  handleRequest(createCategory)
);
router.put(
  "/:id",
  authenticate,
  validateReqSchema(updateCategorySchema),
  handleRequest(updateCategory)
);
router.delete(
  "/:id",
  authenticate,
  validateReqSchema(categoryIdParamSchema),
  handleRequest(deleteCategory)
);

export default router;
