import _ from "lodash";
import { createHmsRoomService } from "../../services/hmsService/managementHms.service";

const createHmsRoomsController = async (req, res) => {
  try {
    langoLogger.info("Creating HMS Rooms");
    const name = _.get(req.body, ["name"]);
    const description = _.get(req.body, ["description"]);
    const response = await createHmsRoomService(name, description);
    langoLogger.info("Successfully created HMS Room");
    res.status(201).json(response);
  } catch (e) {
    langoLogger.error(e.message);
    res.status(500).json(e.message);
  }
};

export default createHmsRoomsController;
