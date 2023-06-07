import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { getUserDetailsFromDb } from "../Model/yekola.db.js";
import {
  ADMIN_ONLY_OPERATIONS,
  INVALID_DETAILS,
  MULTIPLE_ACCOUNT_EXISTS,
  USER_NOT_EXIST,
} from "../configurations/constants/configMessages.js";
import database from "../Model/sequelize.js";
import { STUDENT_ROLE } from "./../utils/roomConstants.js";
import _ from "lodash";

export const loginUserService = async (userDataObj) => {
  try {
    const { email, role, user_name, name, room_edit_allowed, admin } = userDataObj;
    const accessToken = generateAccessToken({
      name,
      userName: user_name,
      role,
      email,
      roomEditAllowed: room_edit_allowed,
      admin
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
    const role = STUDENT_ROLE;
    const securedPassword = await generateHashedPassword(password);
    const dataObj = {
      email,
      userName,
      role,
      name,
    };

    const response = await database.Roles.findOne({ where: { role } });
    const role_id = response?.dataValues?.id;
    await database.Users.create({
      name,
      email,
      role_id,
      userName,
      password: securedPassword,
    });
    const accessToken = generateAccessToken(dataObj);
    yekolaLogger.info("Successfully Registered User");
    return accessToken;
  } catch (e) {
    yekolaLogger.error("Error while registering user", e);
    throw new Error("Error in Register User Service");
  }
};

export const generateAccessToken = (userObj) => {
  const accessToken = jwt.sign(
    {
      data: userObj,

      // exp: Math.floor(Date.now() / 1000) + 30 * 1, // 30 secs
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 30 secs
    },
    process.env.AUTH_TOKEN,
    {}
  );
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

export const updateUserRolesService = async (userDetails, executionUser) => {
  try {
    const promiseArr= [];
    const { Users } = database;
    const result = await getUserDetailsFromDb(executionUser);
    const executionUserDetails = result[0];
   if(!executionUserDetails.admin) {
    return { error: true, reason: ADMIN_ONLY_OPERATIONS, errCode: 403 };
    
   }
   yekolaLogger.info("Updating User Roles", userDetails?.toString())
    userDetails.forEach(userDetail => {
      const { userName, roleId } = userDetail;
      const upadteQuery = Users.update(
        {
          role_id: roleId,
        },
        {
          where: {
            user_name: userName,
          },
        }
      )
      promiseArr.push(upadteQuery);
    });

    const response = await Promise.all(promiseArr);
    yekolaLogger.info("Successfully updated user roles");
  } catch (e) {
    console.error(e);
    yekolaLogger.error("Error while updating user details", e.message);
    throw new Error(e.message);
  }
}

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

