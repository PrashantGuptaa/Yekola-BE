import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { addUserToDb } from "../Model/yekola.db";
import { getHigestPermissionRoleAmongAll } from "../utils/utils";

export const loginUserService = async (userDataObj) => {
  try {
    const { email, password, roles, user_name } = userDataObj;
    const accessToken = generateAccessToken({
      ...userDataObj,
      userName: user_name,
      activeRole: getHigestPermissionRoleAmongAll(roles),
    });
    return accessToken;
  } catch (e) {
    yekolaLogger.error(e);
    throw new Error("Error in Login User Service");
  }
};

export const registerUserService = async (userDataObj) => {
  try {
    const { email, password, roles, userName, name } = userDataObj;
    const securedPassword = await bcryptjs.hash(password, 10);
    const dataObj = {
      email,
      password: securedPassword,
      userName,
      roles,
      activeRole: getHigestPermissionRoleAmongAll(roles),
      name,
    };

    await addUserToDb(email, userName, securedPassword, roles, name);
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
