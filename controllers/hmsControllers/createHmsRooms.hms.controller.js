import _ from "lodash";
import { createHmsRoomService } from "../../services/hmsService/managementHms.service";

const createHmsRoomsController = async (req, res) => {
  try {
    yekolaLogger.info("Creating HMS Rooms");
    const name = _.get(req.body, ["name"]);
    const description = _.get(req.body, ["description"]);
    const response = await createHmsRoomService(name, description);
    yekolaLogger.info("Successfully created HMS Room");
    res.status(201).json(response);
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json(e.message);
  }
};

export default createHmsRoomsController;
