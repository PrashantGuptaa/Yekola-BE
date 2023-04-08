import jwt from "jsonwebtoken";
import {
  MISSING_TOKEN,
  TOKEN_EXPIRED,
} from "../configurations/constants/configMessages.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    yekolaLogger.info(`Validating token`);
    if (!token)
      return res
        .status(401)
        .json({ error: MISSING_TOKEN, authenticated: false });

    jwt.verify(token, process.env.AUTH_TOKEN, (err, userData) => {
      if (err) {
        yekolaLogger.error(err);
        return res
          .status(403)
          .json({ error: TOKEN_EXPIRED, authenticated: false });
      }
      req.user = userData.data;
      yekolaLogger.info(`Successfully validated token`);
      next();
    });
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json({ error: e.message });
  }
};
