import mongoose from "mongoose";
import { config } from "dotenv";
config();

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbConn = mongoose.connection;
dbConn.on("connected", function () {
  console.log("Database is connected successfully");
});
dbConn.on("disconnected", function () {
  console.log("Database is disconnected successfully");
});

dbConn.on("error", console.error.bind(console, "connection error:"));

export default dbConn;