import _ from "lodash";
import { generateAppTokenHmsService } from "../../services/hmsService/appHms.service.js";

const fetchHmsRoomAppTokenController = async (req, res) => {
  try {
    const user = req.user;
    yekolaLogger.info(`Fetching Access token for HMS-Room for userObj`, user);
    const roomId = _.get(req.params, ["roomId"]);
    const { role, userName, name } = user;
    const authToken = await generateAppTokenHmsService(roomId, userName, role);
    yekolaLogger.info("Successfully fetched access token for HMS Room");
    res.status(200).json({ authToken, name });
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json(e.message);
  }
};

export default fetchHmsRoomAppTokenController;
