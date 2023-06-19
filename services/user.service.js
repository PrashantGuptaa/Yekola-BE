import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import {
  ADMIN_ONLY_OPERATIONS,
  INVALID_DETAILS,
  MULTIPLE_ACCOUNT_EXISTS,
  USER_NOT_EXIST,
} from "../configurations/constants/configMessages.js";
import { ADMIN_ROLE, LISTENER_ROLE } from "./../utils/roomConstants.js";
import _ from "lodash";
import UserModel from "../Model/user.schema.js";

export const loginUserService = async (userDataObj) => {
  try {
    const { email, role, userName, name } =
      userDataObj;
    const accessToken = generateAccessToken({
      name,
      userName,
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
    yekolaLogger.info("Registering User in user service", userDataObj);
    const { email, password, userName, name } = userDataObj;
    const role = LISTENER_ROLE;
    const securedPassword = await generateHashedPassword(password);
    const dataObj = {
      email,
      userName,
      role,
      name,
      password: securedPassword,
      createAt: new Date(),
      updatedAt: new Date()
    };

    await UserModel.collection.insertOne(dataObj);
    const accessToken = generateAccessToken(dataObj);
    yekolaLogger.info("Successfully Registered User");
    return accessToken;
  } catch (e) {
    yekolaLogger.error("Error while registering user", e);
    throw new Error(e);
  }
};

export const generateAccessToken = (userObj) => {
  const accessToken = jwt.sign(
    {
      data: userObj,

      // exp: Math.floor(Date.now() / 1000) + 30 * 1, // 30 secs
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    },
    process.env.AUTH_TOKEN,
    {}
  );
  return accessToken;
};

export const updatePasswordService = async (userName, newPassword) => {
  try {
    // const { Users } = database;
    const password = await generateHashedPassword(newPassword);
    await UserModel.findOneAndUpdate(
      {
        userName,
      },
      {
        password,
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
    const result = await UserModel.find({ userName });
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

export const updateUserRolesService = async (userDetails, executionUser) => {
  try {
    const promiseArr = [];
    if (executionUser.role != ADMIN_ROLE) {
      return { error: true, reason: ADMIN_ONLY_OPERATIONS, errCode: 403 };
    }
    yekolaLogger.info("Updating User Roles", userDetails?.toString());
    userDetails.forEach((userDetail) => {
      const { userName, role } = userDetail;
      const upadteQuery = UserModel.findOneAndUpdate({ userName }, { role });
      promiseArr.push(upadteQuery);
    });

    await Promise.all(promiseArr);
    return { error: false };

    yekolaLogger.info("Successfully updated user roles");
  } catch (e) {
    console.error(e);
    yekolaLogger.error("Error while updating user details", e.message);
    throw new Error(e.message);
  }
};

// export const isUserAdmin = async () => {
//   try {

//   } catch (e) {
//     con
//   }
// }

const generateHashedPassword = async (password) => {
  const securedPassword = await bcryptjs.hash(password, 10);
  return securedPassword;
};

// "password": "1234567890",
// "userName": "adminUser",
