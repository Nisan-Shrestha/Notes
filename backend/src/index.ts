import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import config from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/logger";
import router from "./routes/router";

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
