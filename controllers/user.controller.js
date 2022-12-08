import {
  loginUserService,
  registerUserService,
} from "../services/user.service";
import bcryptjs from "bcryptjs";
import { getUserDetailsFromDb } from "../Model/yekola.db";
import {
  INVALID_DETAILS,
  MULTIPLE_ACCOUNT_EXISTS,
  USER_NOT_EXIST,
} from "../configurations/constants/configMessages";

export const loginUserController = async (req, res) => {
  try {
    const { password, userName } = req.body;
    yekolaLogger.info(`Attemping to login user with user name: ${userName}`);
    const result = await getUserDetailsFromDb(userName);
    if (result.length > 1) {
      return res.status(409).json({ error: MULTIPLE_ACCOUNT_EXISTS });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: USER_NOT_EXIST });
    }
    const userDetails = result[0];
    const securedPassword = userDetails.password;
    const compareResult = await bcryptjs.compare(password, securedPassword);
    if (!compareResult) {
      return res.status(403).json({ error: INVALID_DETAILS });
    }
    const accessToken = await loginUserService(userDetails);
    yekolaLogger.info("Successfully generated access token for user");
    res.status(200).json({ accessToken });
  } catch (e) {
    yekolaLogger.error(e);
    res.status(500).json({ error: e.message });
  }
};

export const registerUserController = async (req, res) => {
  try {
    const result = await getUserDetailsFromDb(req.body.userName);
    if (result.length > 0) {
      return res
        .status(409)
        .json({ error: "Account with given user name already exists" });
    }
    yekolaLogger.info("Registering User...");
    const accessToken = await registerUserService(req.body);
    yekolaLogger.info(
      "Sucessfully registered and generated access token for user"
    );
    res.status(201).json({ accessToken });
  } catch (e) {
    yekolaLogger.error(e);
    res.status(500).json({ error: e.message });
  }
};
