const { get } = require("lodash");
const { APIService } = require("../services/hmsService/apiService");
const { TokenService } = require("../services/hmsService/tokenService");
const {logger} = require("../services/logService");
const sendResponse = require("../utils/responseUtils");

const tokenService = new TokenService();
const apiService = new APIService(tokenService);

const User = require("../Model/userModel");
const Room = require("../Model/roomModel");

const createRoom = async (req, res) => {
  try {
    logger.info("Creating room in 100MS");
    const userId = get(req, ["userData", "userId"]);
    // const roomDetails = await Room.findOne({ instructor: userId });

    const { name, description, startDateTime, endDateTime } = req.body;
    if (name?.trim()?.includes(" ")) {
      return sendResponse(
        res,
        401,
        'Room name cannot contain whitespaces (" ")'
      );
    }

    const payload = {
      name,
      description,
      template_id: process.env.HMS_TEMPLATE_ID,
      region: "auto",
    };

    const resData = await apiService.post("/rooms", payload);
    const { id: roomId, app_id: appId } = resData;
    logger.info("Succuessfully created room in 100MS");

    logger.info("Saving room details in db");
    const room = new Room({
      name,
      description,
      startDateTime,
      endDateTime,
      roomId,
      appId,
      instructor: userId,
      createdBy: userId,
      updatedBy: userId,
    });

    await room.save();
    logger.info("Successfully saved room details in db");

    sendResponse(res, 201, "Room created successfully", { roomId });
  } catch (e) {
    const m = `Error while creating room:${e.message}`;
    logger.error(m);
    return sendResponse(res, 500, m);
  }
};

const getHmsRoomAuthToken = async (req, res) => {
  try {
    logger.info("Fetching room access token");
    const { roomId } = req.params;
    const userId = get(req, ["userData", "userId"]);
    const role = get(req, ["userData", "role"]);

    const roomToken = tokenService.getAuthToken({
      room_id: roomId,
      user_id: userId,
      role,
    });
    logger.info("Successfully fetched room access token");

    sendResponse(res, 200, "Room created successfully", { roomToken });
  } catch (e) {
    const m = `Error while fetching auth token: ${e.message}`;
    logger.error(m);
    return sendResponse(res, 500, m);
  }
};

module.exports = {
  createRoom,
  getHmsRoomAuthToken,
};
