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
const bodyParser = require("body-parser");

const port = process.env.APP_PORT;
const mongoUrl = process.env.MONGO_CONNECTION_STRING;

// Middleware
app.use(cors());
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
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
