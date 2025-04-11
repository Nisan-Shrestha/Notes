import express from "express";
import { signup } from "../controllers/Auth.Controller";
import { validateZod } from "../middlewares/validator";
import { createUserSchema } from "../schemas/Auth.Schema";
import { handleRequest } from "../utils/requestHandler";

const router = express();

router.post("/signup", validateZod(createUserSchema), handleRequest(signup));

export default router;
