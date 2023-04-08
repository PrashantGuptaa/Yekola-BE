import express from "express";
import createHmsRoomsController from "../../controllers/hmsControllers/createHmsRooms.hms.controller.js";
import fetchHmsRoomAppTokenController from "../../controllers/hmsControllers/fetchHmsRoomAppToken.hms.controller.js";
import listHmsRoomsController from "../../controllers/hmsControllers/listHmsRooms.hms.controller.js";
import { checkIfRoomEditAllowedMiddleware } from "../../middlewares/checkIfRoomEditAllowed.middleware.js";
import { authenticate } from "./../../middlewares/authenticate.js";

const hmsRouter = express.Router();

hmsRouter.post(
  "/create-rooms",
  authenticate,
  checkIfRoomEditAllowedMiddleware,
  createHmsRoomsController
);
hmsRouter.get("/list-hms-rooms", authenticate, listHmsRoomsController);
hmsRouter.get(
  "/fetch-app-token/:roomId",
  authenticate,
  fetchHmsRoomAppTokenController
);

export default hmsRouter;
