import {
  loginUserService,
  registerUserService,
} from "../services/user.service";
import { UserModel } from "./../Model/user.model";
import bcryptjs from "bcryptjs";

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    yekolaLogger.info(`Attemping to login user with email: ${email}`);
    const result = await UserModel.find({ email });
    if (result.length > 1) {
      return res
        .status(409)
        .json({ error: "Multiple account assoiciated with given email" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    const securedPassword = result[0].password;
    const compareResult = await bcryptjs.compare(password, securedPassword);
    if (!compareResult) {
      return res.status(403).json({ error: "Invalied Email or Password" });
    }
    const accessToken = await loginUserService(req.body);
    yekolaLogger.info("Successfully generated access token for user");
    res.status(200).json({ accessToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

export const registerUserController = async (req, res) => {
  try {
    const result = await UserModel.find({ email: req.body.email });
    console.log(result);
    if (result.length > 0) {
      return res
        .status(409)
        .json({ error: "Account with given email already exists" });
    }
    yekolaLogger.info("Registering User...");
    const accessToken = await registerUserService(req.body);
    res.status(200).json({ accessToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
