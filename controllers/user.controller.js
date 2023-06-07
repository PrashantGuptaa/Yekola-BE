import {
  loginUserService,
  registerUserService,
  updatePasswordService,
  updateUserRolesService,
  userVerificationService,
} from "../services/user.service.js";
import { getUserDetailsFromDb } from "../Model/yekola.db.js";
import _ from "lodash";

export const loginUserController = async (req, res) => {
  try {
    const { userName } = req.body;
    yekolaLogger.info(`Attemping to login user with user name: ${userName}`);
    const { error, reason, errCode, userDetails } =
      await userVerificationService(req.body);
    if (error) {
      res.status(errCode).json({ error: reason });
      return;
    }
    const accessToken = await loginUserService(userDetails);
    const role = _.get(userDetails, ["role"]);
    yekolaLogger.info("Successfully generated access token for user");
    res.status(200).json({ accessToken, role });
  } catch (e) {
    console.error(e);
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

export const getCheckUserAuthenticationController = async (req, res) =>
  res.status(200).json({ authenticated: true });

export const updatePasswordController = async (req, res) => {
  try {
    const { userName, previousPassword, newPassword } = req.body;
    const { error, errCode, reason } = await userVerificationService({
      userName,
      password: previousPassword,
    });
    if (error) {
      res.status(errCode).json({ error: reason });
      return;
    }

    yekolaLogger.info("Updating Password after user validation");
    await updatePasswordService(userName, newPassword);
    yekolaLogger.info(`Succesfully Updated Password for user: ${userName}`);
    res.status(200).json({ success: true });
  } catch (e) {
    yekolaLogger.error(e);
    res.status(500).json({ error: e.message });
  }
};

export const updateUserRoleController = async (req, res) => {
try {
  const { userDetails } = req.body;
  const {error, errCode, reason} = await updateUserRolesService(userDetails, _.get(req, ['user', 'userName']));
  if (error) {
    res.status(errCode).json({ error: reason });
    return;
  }
  res.status(200).json({ success: true });
} catch (e) {
  yekolaLogger.error(e);
  res.status(500).json({ error: e.message });
}
}