import express from "express";
import { login, refresh, signup } from "../controllers/Auth.Controller";
import { validateReqSchema } from "../middlewares/validator";
import { createUserSchema, loginSchema } from "../schemas/Auth.Schema";
import { handleRequest } from "../utils/requestHandler";

const router = express();

router.post(
  "/signup",
  validateReqSchema(createUserSchema),
  handleRequest(signup)
);
router.post("/login", validateReqSchema(loginSchema), handleRequest(login));
router.post("/refresh-token", handleRequest(refresh));

export default router;
