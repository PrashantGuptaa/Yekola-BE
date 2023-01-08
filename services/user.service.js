import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { addUserToDb, getUserDetailsFromDb } from "../Model/yekola.db";
import {
  INVALID_DETAILS,
  MULTIPLE_ACCOUNT_EXISTS,
  USER_NOT_EXIST,
} from "../configurations/constants/configMessages";
import database from "../Model/sequelize";

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
    yekolaLogger.error(e.message);
    throw new Error("Error in Login User Service", e.message);
  }
};

export const registerUserService = async (userDataObj) => {
  try {
    const { email, password, role, userName, name } = userDataObj;
    const securedPassword = await generateHashedPassword(password);
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
  const accessToken = jwt.sign({data: userObj,
  
    exp: Math.floor(Date.now() / 1000) + 30 * 1,
  }, process.env.AUTH_TOKEN, {
  });
  return accessToken;
};

export const updatePasswordService = async (userName, newPassword) => {
  try {
    const { Users } = database;
    const password = await generateHashedPassword(newPassword);
    await Users.update(
      {
        password,
      },
      {
        where: {
          user_name: userName,
        },
      }
    );
  } catch (e) {
    console.error(e);
    throw new Error("Error while updating password", e.message);
  }
};

export const userVerificationService = async (userObj) => {
  try {
    yekolaLogger.info(`Verifying User details for user: ${userObj}`);
    const { password, userName } = userObj;
    const result = await getUserDetailsFromDb(userName);
    if (result.length > 1) {
      return { error: true, reason: MULTIPLE_ACCOUNT_EXISTS, errCode: 409 };
    }
    if (result.length === 0) {
      return { error: true, reason: USER_NOT_EXIST, errCode: 404 };
    }
    const userDetails = result[0];
    const securedPassword = userDetails.password;
    const compareResult = await bcryptjs.compare(password, securedPassword);
    if (!compareResult) {
      return { error: true, reason: INVALID_DETAILS, errCode: 403 };
    }
    yekolaLogger.info("Successfully verfied user");
    return { error: false, userDetails };
  } catch (e) {
    console.error(e);
    yekolaLogger.error("Error while verifying User", e.message);
    throw new Error(e.message);
  }
};

const generateHashedPassword = async (password) => {
  const securedPassword = await bcryptjs.hash(password, 10);
  return securedPassword;
};
