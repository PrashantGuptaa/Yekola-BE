const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController"); // Import the auth controller
const hmsController = require("../controllers/hmsController"); // Import the auth controller
const authenticateUser = require("../middlewares/authMiddleware");
const {
  checkUserAllowedForEditEoom,
} = require("../middlewares/roleMiddleware");

// List rooms Route
router.get("/list", authenticateUser, roomController.getRooms);
router.post(
  "/create",
  authenticateUser,
  checkUserAllowedForEditEoom,
  hmsController.createRoom
);

// Token to enter room
router.get(
  "/token/:roomId",
  authenticateUser,
  hmsController.getHmsRoomAuthToken
);

// Room creation allowed
router.get(
  "/permitted",
  authenticateUser,
  checkUserAllowedForEditEoom,
  roomController.confirmRoomCreation
);

module.exports = router;
