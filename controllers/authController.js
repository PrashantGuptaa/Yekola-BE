// authController.js
const { get } = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env

const { ADMIN_ROLE, USER_ROLES } = require("./../utils/roomConstants");
const sendResponse = require("../utils/responseUtils");

const {
  generateToken,
  getWelcomeEmailSubject,
  getWelcomeEmailBody,
} = require("../utils/authUtils");

const User = require("../Model/userModel");
const { logger, setUserContext } = require("../services/logService");
const { sendEmailService } = require("../services/emailService");
const {
  sendOtpService,
  sendResetEmailService,
} = require("../services/authService");
const { readFromS3Service } = require("../services/s3Service");

const signUp = async (req, res) => {
  try {
    const startTime = Date.now();
    setUserContext(req.body || {});
    logger.info("Registering User");
    const { email, password, userName, name, role } = req.body;

    const existingUserWithEmail = await User.findOne({ email });

    if (existingUserWithEmail) {
      return sendResponse(res, 400, "Email is already registered.");
    }

    const existingUserWithUserName = await User.findOne({ userName });

    if (existingUserWithUserName) {
      return sendResponse(res, 400, "User name is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      userName,
      name,
      role,
    });
    await user.save();
    const { _id: userId, active } = user;
    const token = generateToken(userId, email, role, active, name, "12h"); // Generate a token with userId, email, and role

    await sendOtpService({ userId, email, role, name });

    logger.info(
      `Registered User. Time Taken: ${(Date.now() - startTime) / 1000}s`
    );
    return sendResponse(res, 201, "User registration successful.", {
      token,
      email,
      name,
      role,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      500,
      `Error while registering user: ${error.message}`
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Logging email: ${email}`);

    if (!email || !password) {
      return sendResponse(
        res,
        401,
        "Authentication failed. Email and password are mandatory fields."
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(
        res,
        401,
        "Authentication failed. Email is not registered."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(
        res,
        401,
        "Authentication failed. Invalid credentials."
      );
    }

    const { _id: userId, role, active, name } = user;
    logger.info(`Fetching profile image from s3`);
    const profile = await readFromS3Service(userId.toString());
    logger.info(`Successfully fetched profile image from s3`);

    const token = generateToken(userId, email, role, active, name, "12h"); // Generate a token with userId, email, and role
    logger.info(`Logged user with email: ${email}`);

    if (!active) {
      sendOtpService({ userId, role, email, name });
    }

    setUserContext({ userId, email });

    return sendResponse(res, 200, "Authentication successful.", {
      token,
      active,
      email,
      name,
      role,
      profile: profile.toString(),
    });
  } catch (error) {
    logger.error(error);
    return sendResponse(res, 500, "Error while logging in");
  }
};

const sendOtpToUser = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(res, 401, "Authentication failed. Token is missing.");
    }

    jwt.verify(token, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) {
        logger.error(err.message);
        return sendResponse(res, 401, "Authentication failed. Invalid token.");
      }

      await sendOtpService(user);

      return sendResponse(res, 201, "OTP sent to user successfully.");
    });
  } catch (e) {
    const m = `Error while sending OTP: ${e.message}`;
    logger.error(m);
    return sendResponse(res, 500, m);
  }
};

const verifyOtpFromUser = async (req, res) => {
  try {
    logger.info(`Verifying OTP for user`);
    const { otp, token } = req.body;

    if (!otp) {
      return sendResponse(res, 401, "Authentication failed. OTP is missing.");
    }

    if (!token) {
      return sendResponse(res, 401, "Authentication failed. Token is missing.");
    }

    jwt.verify(token, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) {
        return sendResponse(
          res,
          401,
          "Authentication failed. Please login again."
        );
      }

      const { userId, email, role, name } = user;
      const userData = await User.findById(userId);

      const { otp: otpDetails } = userData;
      const lastInd = otpDetails.lastIndexOf("_");

      const hashedOtp = otpDetails.slice(0, lastInd);
      const validity = otpDetails.slice(lastInd + 1);

      if (validity < Date.now()) {
        return sendResponse(res, 400, "OTP no longer valid.");
      }

      const isOtpValid = await bcrypt.compare(otp, hashedOtp);

      if (isOtpValid) {
        await User.findByIdAndUpdate(userId, { active: true });
        await sendEmailService(
          email,
          getWelcomeEmailSubject(name),
          getWelcomeEmailBody()
        );
        return sendResponse(res, 200, "OTP verification successful.", {
          token: generateToken(userId, email, role, true, name, "12h"),
          name,
          email,
          role,
        });
      }

      return sendResponse(res, 400, "OTP verification failed. Invalid OTP.");
    });
  } catch (e) {
    const m = `Error while verifying OTP: ${e.message}`;
    logger.error(m);
    return sendResponse(res, 500, m);
  }
};

const changeUserRole = async (req, res) => {
  try {
    const userEmailToChange = get(req.params, ["email"], "");

    // Check if the authenticated user is an admin
    if (get(req, ["userData", "role"]) !== ADMIN_ROLE) {
      return sendResponse(res, 403, "Access denied.");
    }

    // Get the new role from the request body
    const { newRole } = req.body;

    if (!USER_ROLES.includes(newRole)) {
      return sendResponse(res, 404, "Requested role do not exists");
    }

    // Find the user by userId
    const userToChange = await User.findOne({ email: userEmailToChange });

    if (!userToChange) {
      return sendResponse(res, 404, "User not found.");
    }

    // Update the role of the user
    userToChange.role = newRole;
    await userToChange.save();
    logger.info(
      `Successfully updated user role for email ${userEmailToChange} by user ${get(
        req,
        ["userData", "email"]
      )}`
    );
    return sendResponse(res, 200, "User role updated successfully.", {
      newRole: userToChange.role,
    });
  } catch (error) {
    logger.error(error.message);
    return sendResponse(
      res,
      500,
      `Error while updating user role: ${error.message}`
    );
  }
};

const sendPasswordResetEmailToUser = async (req, res) => {
  try {
    const email = get(req.body, ["email"]);
    if (!email) {
      return sendResponse(res, 403, "Email is mandatory field.");
    }
    // Find the user by userId
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 404, "User not found.");
    }
    await sendResetEmailService(email);
    return sendResponse(res, 200, "OTP sent to user successfully.");
  } catch (e) {
    const m = `Error while sending OTP: ${e.message}`;
    logger.error(m);
    return sendResponse(res, 500, m);
  }
};

const verifyPasswordResetFromUser = async (req, res) => {
  try {
    logger.info(`Reseting password for user`);
    const email = get(req.body, ["email"]);
    const password = get(req.body, ["password"]);
    const retypePassword = get(req.body, ["retypePassword"]);
    const securityCode = get(req.body, ["securityCode"]);

    if (!email || !password || !securityCode) {
      return sendResponse(
        res,
        401,
        "Password Reset failed. Email, Password are mandatory fields."
      );
    }

    if (password !== retypePassword) {
      return sendResponse(
        res,
        401,
        "Password Reset failed. Email, Re password should be same as password."
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(
        res,
        400,
        "Password Reset failed. No Account is linked with email: " + email
      );
    }

    const { resetPasswordOtp, _id: userId } = user;
    const lastInd = resetPasswordOtp.lastIndexOf("_");

    const hashedOtp = resetPasswordOtp.slice(0, lastInd);
    const validity = resetPasswordOtp.slice(lastInd + 1);

    if (validity < Date.now()) {
      return sendResponse(res, 400, "OTP no longer valid.");
    }

    const isOtpValid = await bcrypt.compare(securityCode, hashedOtp);
    if (isOtpValid) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      return sendResponse(res, 200, "Password reset Successful.");
    }

    return sendResponse(res, 400, "OTP verification failed. Invalid OTP.");
  } catch (e) {
    const m = `Error while verifying OTP: ${e.message}`;
    logger.error(m);
    return sendResponse(res, 500, m);
  }
};

const confirmUserAuthorization = async (req, res) =>
  sendResponse(res, 200, "Authentication Successful.", { authenticated: true });

module.exports = {
  signUp,
  login,
  sendOtpToUser,
  verifyOtpFromUser,
  changeUserRole,
  confirmUserAuthorization,
  sendPasswordResetEmailToUser,
  verifyPasswordResetFromUser,
};
