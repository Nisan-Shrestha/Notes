import express from "express";
import {
  checkUsername,
  getSelf,
  login,
  logout,
  refresh,
  signup
} from "../controllers/Auth.Controller";
import { validateReqSchema } from "../middlewares/validator";
import { createUserSchema, loginSchema } from "../schemas/Auth.Schema";
import { handleRequest } from "../utils/requestHandler";

const router = express();

router.get("/me", handleRequest(getSelf));
router.get("/check-username/:username", handleRequest(checkUsername));
router.post(
  "/signup",
  validateReqSchema(createUserSchema),
  handleRequest(signup)
);
router.post("/login", validateReqSchema(loginSchema), handleRequest(login));
router.post("/refresh-token", handleRequest(refresh));
router.post("/logout", handleRequest(logout));
export default router;
