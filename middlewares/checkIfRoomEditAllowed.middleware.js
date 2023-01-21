import jwt from "jsonwebtoken";
import {
  MISSING_TOKEN,
  ROOM_EDIT_NOT_ALLOWED,
  TOKEN_EXPIRED,
} from "../configurations/constants/configMessages";

export const checkIfRoomEditAllowedMiddleware = async (req, res, next) => {
  try {
    const {  roomEditAllowed } = req.user;
    yekolaLogger.info(`Validating if user has access to edit room`);
    if (!roomEditAllowed) {
        return res.status(405).json({ error: ROOM_EDIT_NOT_ALLOWED, roomEditAllowed: false });
      }
      yekolaLogger.info(`Successfully validated - User can edit room`);
      next();

  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json({ error: e.message });
  }
};
