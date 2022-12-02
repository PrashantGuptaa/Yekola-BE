import _ from "lodash";
import { generateAppTokenHmsService } from "../../services/hmsService/appHms.service";

const fetchHmsRoomAppTokenController = async (req, res) => {
  try {
    const user = req.user;
    langoLogger.info(`Fetching Access token for HMS-Room for userObj ${user}`);
    const roomId = _.get(req.params, ["roomId"]);
    // const description = _.get(req.body, ["description"]);
    const { role, email } = user;
    const accessToken = await generateAppTokenHmsService(roomId, email, role);
    langoLogger.info("Successfully fetched access token for HMS Room");
    res.status(200).json({ accessToken });
  } catch (e) {
    langoLogger.error(e.message);
    res.status(500).json(e.message);
  }
};

export default fetchHmsRoomAppTokenController;
