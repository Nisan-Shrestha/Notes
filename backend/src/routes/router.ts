import express from "express";
import { Request } from "../utils/requestHandler";
import authRouter from "./Auth.Routes";
import categoriesRouter from "./Categories.Routes";
import notesRouter from "./Notes.Routes";
const router = express();
// router.use("/auth", authRouter);

router.get("/", (req: Request, res) => {
  console.log(req.cookies);
  res.send("Hello WOrld");
});

router.use("/auth", authRouter);
router.use("/notes", notesRouter);
router.use("/categories", categoriesRouter);
//
export default router;
