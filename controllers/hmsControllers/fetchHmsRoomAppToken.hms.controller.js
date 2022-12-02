import _ from "lodash";
import { generateAppTokenHmsService } from "../../services/hmsService/appHms.service";

const fetchHmsRoomAppTokenController = async (req, res) => {
  try {
    const user = req.user;
    yekolaLogger.info(`Fetching Access token for HMS-Room for userObj ${user}`);
    const roomId = _.get(req.params, ["roomId"]);
    // const description = _.get(req.body, ["description"]);
    const { activeRole, userName } = user;
    const hmsAppAccessToken = await generateAppTokenHmsService(roomId, userName, activeRole);
    yekolaLogger.info("Successfully fetched access token for HMS Room");
    res.status(200).json({ hmsAppAccessToken });
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json(e.message);
  }
};

export default fetchHmsRoomAppTokenController;
