// roomController.js
const Room = require("../Model/roomModel"); // Import the Room model
const { logger } = require("../services/logService");
const sendResponse = require("../utils/responseUtils");

const getRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number (default to 1 if not provided)
    const perPage = parseInt(req.query.perPage) || 10; // Number of rooms per page (default to 10 if not provided)
    logger.info(
      `Fetching list of rooms for page: ${page} and per page: ${perPage}`
    );

    // Calculate the number of documents to skip
    const skip = (page - 1) * perPage;

    // Fetch the list of rooms in descending order of createdAt
    const roomsPromise = Room.find(
      { deleted: false },
      "_id name description startDateTime endDateTime roomId"
    )
      .populate("instructor", "name")
      .sort({ createdAt: -1 })
      .skip(skip) // Skip the specified number of documents
      .limit(perPage)
      .exec();

    const roomsCountPromise = Room.countDocuments({ deleted: false });
    const [rooms, roomsCount] = await Promise.all([
      roomsPromise,
      roomsCountPromise,
    ]);

    logger.info("Successfully fetched list of rooms");

    return sendResponse(res, 200, "Rooms fetched successfully.", {
      rooms,
      roomsCount,
    });
  } catch (error) {
    logger.error(error.message);
    return sendResponse(
      res,
      500,
      `Error while fetching list of rooms: ${error.message}`
    );
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    logger.info(`Deleting room with id: ${roomId}`);

    await Room.findOneAndUpdate({ roomId }, { deleted: true });

    logger.info("Successfully deleted room with id " + roomId);

    return sendResponse(res, 200, "Rooms deleted successfully.", {});
  } catch (error) {
    logger.error(error.message);
    return sendResponse(
      res,
      500,
      `Error while deleting room: ${error.message}`
    );
  }
};

const confirmRoomCreation = async (req, res) =>
  sendResponse(res, 200, "Authorized to create room", {
    roomEditAllowed: true,
  });

module.exports = { getRooms, confirmRoomCreation, deleteRoom };
