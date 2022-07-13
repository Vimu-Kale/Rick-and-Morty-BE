import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./db/connection.js";
import cors from "cors";
import morganMiddleware from "./middlewares/morganMiddleware.js";
import logger from "./utils/logger.js";
import router from "./routes/index.js";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.static("public"));
// app.use(express.urlencoded({ extends: true }));
app.use(express.json());
app.use(morganMiddleware);

app.use(router);

app.listen(PORT, () => {
  logger.info(`server listening on port .: ${PORT}`);
});
