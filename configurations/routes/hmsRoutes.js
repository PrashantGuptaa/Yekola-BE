import express from "express";
import createHmsRoomsController from "../../controllers/hmsControllers/createHmsRooms.hms.controller";
import fetchHmsRoomAppTokenController from "../../controllers/hmsControllers/fetchHmsRoomAppToken.hms.controller";
import listHmsRoomsController from "../../controllers/hmsControllers/listHmsRooms.hms.controller";
import { checkIfRoomEditAllowedMiddleware } from "../../middlewares/checkIfRoomEditAllowed.middleware";
import { authenticate } from "./../../middlewares/authenticate";

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
