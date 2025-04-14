import cookieParser from "cookie-parser";
import express from "express";
import config from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/logger";
import router from "./routes/router";

const app = express();
app.use(requestLogger);
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
