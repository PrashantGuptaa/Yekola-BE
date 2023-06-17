import express from "express";
import { config } from "dotenv";
import cors from "cors";
import router from "./configurations/routes/routes.js";
import winstonLogger from "./utils/logger.js";
import bodyParser from "body-parser";
import hmsRouter from "./configurations/routes/hmsRoutes.js";
import healthTestController from "./controllers/health.controller.js";
import './Model/connection.js';

config();
const app = express();

// Middlewares
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.json());

// Global Logger
global.yekolaLogger = winstonLogger;

app.use("/api/v1", router);
app.use("/api/v1", hmsRouter);
app.get('/', healthTestController);

const PORT = process.env.APP_PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}⚡ `));
