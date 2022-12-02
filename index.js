import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import router from './configurations/routes.js';
import winstonLogger from './utils/logger.js';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { mongoDbConnection } from './MongoDb/connection';
import hmsRouter from './configurations/hmsRoutes';
import postgresClientConnection from './configurations/postgresConnection.js';

config();
const app = express();


// Middlewares
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.json());

// Global Logger
global.langoLogger = winstonLogger;
mongoDbConnection();

app.use("/api/v1", router);
app.use("/api/hms/v1", hmsRouter);


const PORT = process.env.APP_PORT || 5001;
app.listen(PORT, () => console.log(`⚡⚡ Server is running on PORT:${PORT} ⚡⚡`))