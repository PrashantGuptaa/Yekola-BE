import _ from "lodash";
import { createHmsRoomService } from "../../services/hmsService/managementHms.service.js";

const createHmsRoomsController = async (req, res) => {
  try {
    yekolaLogger.info("Creating HMS Rooms");
    const userName = _.get(req, ["user", "userName"]);

    const response = await createHmsRoomService(
      req.body,
      userName
    );
    yekolaLogger.info("Successfully created HMS Room");
    res.status(201).json(response);
  } catch (e) {
    yekolaLogger.error(e);
    res.status(500).json(e.message);
  }
};

export default createHmsRoomsController;
