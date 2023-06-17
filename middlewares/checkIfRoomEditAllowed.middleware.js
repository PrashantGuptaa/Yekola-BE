import jwt from "jsonwebtoken";
import _ from "lodash";
import {
  MISSING_TOKEN,
  ROOM_EDIT_NOT_ALLOWED,
  TOKEN_EXPIRED,
} from "../configurations/constants/configMessages.js";
import { ADMIN_ROLE, MODERATOR_ROLE } from "../utils/roomConstants.js";

export const checkIfRoomEditAllowedMiddleware = async (req, res, next) => {
  try {
    yekolaLogger.info(`Validating if user has access to edit room`);

    const role = _.get(req, ["user", "role"], "");

    if (![ADMIN_ROLE, MODERATOR_ROLE].includes(role)) {
      return res
        .status(400)
        .json({ error: ROOM_EDIT_NOT_ALLOWED, roomEditAllowed: false });
    }
    yekolaLogger.info(`Successfully validated - User can edit room`);
    next();
  } catch (e) {
    console.error(e);
    yekolaLogger.error(e.message);
    res.status(500).json({ error: e.message });
  }
};
