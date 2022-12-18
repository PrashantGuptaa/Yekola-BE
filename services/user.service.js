import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { addUserToDb } from "../Model/yekola.db";

export const loginUserService = async (userDataObj) => {
  try {
    const { email, role, user_name, name } = userDataObj;
    const accessToken = generateAccessToken({
      name,
      userName: user_name,
      role,
      email,
    });
    return accessToken;
  } catch (e) {
    yekolaLogger.error(e);
    throw new Error("Error in Login User Service");
  }
};

export const registerUserService = async (userDataObj) => {
  try {
    const { email, password, role, userName, name } = userDataObj;
    const securedPassword = await bcryptjs.hash(password, 10);
    const dataObj = {
      email,
      userName,
      role,
      name,
    };

    await addUserToDb(email, userName, securedPassword, role, name);
    const accessToken = generateAccessToken(dataObj);
    return accessToken;
  } catch (e) {
    yekolaLogger.error(e);
    throw new Error("Error in Register User Service");
  }
};

export const generateAccessToken = (userObj) => {
  const accessToken = jwt.sign(userObj, process.env.AUTH_TOKEN);
  return accessToken;
};
