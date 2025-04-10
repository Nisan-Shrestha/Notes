import express from 'express';
import { requestLogger } from "./middlewares/logger";
import router from "./routes/router";

const app = express();
app.use(requestLogger);
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// // import cookieParser from "cookie-parser";
// import cors from "cors";
// import config from "./config";
// import { genericErrorHandler } from "./middleware/errorHandler";

// app.use(
//   cors({
//     origin:true,
//     // Frontend domain
//     credentials: true, // Allow credentials
//   })
// );
// app.use(notFoundError);
// app.use(genericErrorHandler);

// app.listen(config.port, () => {
//   console.log(`Server running on port ${config.port}`);
// });
