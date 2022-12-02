import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { userSchema } from "../Schema/user.schema";
import { UserModel } from "../Model/user.model";

export const loginUserService = async (userDataObj) => {
  try {
    const { email, password } = userDataObj;
        const accessToken = generateAccessToken(email);
    return accessToken;
  } catch (e) {
    console.error(e);
    throw new Error("Error in Login User Service");
  }
};

export const registerUserService = async (userDataObj) => {
  try {
    const { email, password } = userDataObj;// 123 -> @1324efdssv gergbdf
    const securedPassword = await bcryptjs.hash(password, 10);
    const dataObj = {
      email,
      password: securedPassword,
    };
    const userModelInstance = new UserModel(dataObj);

    const result = await userModelInstance.save(dataObj);
    console.log("F-4", result);
    const accessToken = generateAccessToken(email);
    return accessToken;
  } catch (e) {
    console.error(e);
    throw new Error("Error in Register User Service");
  }
};

export const generateAccessToken = (email) => {
  const accessToken = jwt.sign(email, process.env.AUTH_TOKEN);
  return accessToken;
};