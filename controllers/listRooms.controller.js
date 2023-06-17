import HmsRoomsModel from "../Model/hmsRooms.Schema.js";
import { extractUsefulRoomInformation } from "../utils/utils.js";

export const listRoomsController = async (req, res) => {
  try {
    const { product } = req.params;
    yekolaLogger.info(
      `Fetching all room where product is ${product} - controller`
    );
    const response = await HmsRoomsModel.find(
      { product },
    );
    const updatedResponse = response.map((roomObj) =>
      extractUsefulRoomInformation(roomObj)
    );
    yekolaLogger.info("Successfully fetched rooms - controller");
    res.status(200).json(updatedResponse);
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json(e.message);
  }
};
