import express from "express";

import authRouter from "./Auth.Routes";
import { Request } from "../interfaces/Auth.Interface";
const router = express();
// router.use("/auth", authRouter);

router.get("/", (req: Request, res) => {
  console.log(req.cookies);
  res.send("Hello WOrld");
});

router.use("/auth", authRouter);

//
export default router;
