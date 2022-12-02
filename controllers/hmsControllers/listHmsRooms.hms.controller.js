import _ from "lodash";
import {  listHmsRoomsService } from "../../services/hmsService/managementHms.service";

const listHmsRoomsController = async (req, res) => {
  try {
    yekolaLogger.info("Fetching HMS Rooms");
    const response = await listHmsRoomsService();
    yekolaLogger.info("Successfully fetched list of HMS Room");
    res.status(200).json(response);
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json(e.message);
  }
};

export default listHmsRoomsController;
