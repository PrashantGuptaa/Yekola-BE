import database from "../Model/sequelize.js";
import { extractUsefulRoomInformation } from "../utils/utils.js";

export const listRoomsController = async (req, res) => {
  try {
    const { product } = req.params;
    yekolaLogger.info(
      `Fetching all room where product is ${product} - controller`
    );
    const response = await database.Rooms.findAll({
      where: { product },
      order: [["start_date_time", "ASC"]],
    });
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
