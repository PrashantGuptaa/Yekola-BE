import express from "express";
// import generateAccessTokenForHms from './../controllers/hmsControllers/generateAuthToken.controller.hms';
import createHmsRoomsController from "../../controllers/hmsControllers/createHmsRooms.hms.controller";
import fetchHmsRoomAppTokenController from "../../controllers/hmsControllers/fetchHmsRoomAppToken.hms.controller";
import listHmsRoomsController from "../../controllers/hmsControllers/listHmsRooms.hms.controller";
import { authenticate } from "./../../middlewares/authenticate";

const hmsRouter = express.Router();

// hmsRouter.get('/token', generateAccessTokenForHms);
hmsRouter.post("/create-rooms", authenticate, createHmsRoomsController);
hmsRouter.get("/list-hms-rooms", authenticate, listHmsRoomsController);
hmsRouter.get(
  "/fetch-app-token/:roomId",
  authenticate,
  fetchHmsRoomAppTokenController
);

export default hmsRouter;
