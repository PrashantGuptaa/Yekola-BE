// import express from "express";
// import { config } from "dotenv";
// import cors from "cors";
// import router from "./configurations/routes/routes.js";
// import winstonLogger from "./utils/logger.js";
// import bodyParser from "body-parser";
// import hmsRouter from "./configurations/routes/hmsRoutes.js";
// import healthTestController from "./controllers/health.controller.js";
// import './Model/connection.js';

// config();
// const app = express();

// // Middlewares
// app.use(cors());
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());

// app.use(express.json());

// // Global Logger
// global.yekolaLogger = winstonLogger;

// app.use("/api/v1", router);
// app.use("/api/v1", hmsRouter);
// app.get('/', healthTestController);

// const PORT = process.env.APP_PORT || 5001;
// app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}⚡ `));


// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const httpContext = require("express-http-context");

require("dotenv").config(); // Load environment variables from .env

const app = express();
// const logger = require("./services/logger");
// const requestIdMiddleware = require("./middlewares/requestMiddleware");

const routes = require("./routes");
const {logger} = require("./services/logService");
const { v4 } = require("uuid");

const port = process.env.APP_PORT;
const mongoUrl = process.env.MONGO_CONNECTION_STRING;

// Middleware
app.use(cors());
app.use(express.json());

app.use(httpContext.middleware);

app.use((req, res, next) => {
httpContext.set('requestId', req.headers.requestId || v4());
next();
})

// Routes
app.get("/", (req, res) => {
  logger.info("Health check route is working");
  res.send("Welcome! This route is working");
});

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");

    // Define more routes and interact with the database here
    // Use the routes configuration from routes/index.js
    app.use("/api/v1", routes);

    // Start the server after connecting to MongoDB
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
