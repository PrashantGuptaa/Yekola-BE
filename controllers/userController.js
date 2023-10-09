// authController.js
const { get } = require("lodash");
require("dotenv").config(); // Load environment variables from .env

const { ADMIN_ROLE } = require("./../utils/roomConstants");
const sendResponse = require("../utils/responseUtils");


const User = require("../Model/userModel");
const { logger } = require("../services/logService");
const { uploadToS3, readFromS3Service } = require("../services/s3Service");

const uploadImgToS3 = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profilePhoto } = req.body;
    logger.info("Uploading image to S3");
    const fileLocation = await uploadToS3(userId, profilePhoto);
    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        profilePhoto: fileLocation,
      }
    );
    logger.info("Successfully uploaded image to S3");
    sendResponse(res, 200, "Successfully upload to s3");
  } catch (e) {
    const m = `Error while uploading to s3: ${e.message}`;
    logger.error(m);
    sendResponse(res, 500, m, null, e);
  }
};

const fetchUserDetails = async (req, res) => {
  try {
    const email = get(req, ["params", "email"]);
    logger.info(`Fetching user details: ${email}`);
    if (!email) {
      const m = "Email is missing";
      logger.info(res, 400, m);
      sendResponse(res, 400, m);
      return;
    }
    const userDetails = await User.findOne(
      { email },
      {
        otp: 0,
        password: 0,
        profilePhoto: 0,
        active: 0,
      }
    );
    logger.info(`Fetched user details`);

    logger.info(`Fetching profile image from s3`);
    const img = await readFromS3Service(userDetails._id.toString());
    logger.info(`Successfully fetched profile image from s3`);

    userDetails.profilePhoto = img;
    sendResponse(res, 200, "Successfully fetched user details", userDetails);
  } catch (e) {
    const m = `Error while fetching user details: ${e.message}`;
    logger.error(m);
    sendResponse(res, 500, m);
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const userId = get(req, ["params", "userId"]);
    const { langaugesLearning, langaugesLearnt, nationality, bio } = req.body;
    if (req.userData.userId !== userId && req.userData.role !== ADMIN_ROLE) {
      return sendResponse(
        res,
        403,
        "Insufficent Access. You don't have access to update other user details"
      );
    }
    logger.info(`Updating user details for userId: ${userId}`);
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        langaugesLearnt,
        langaugesLearning,
        nationality,
        bio,
      }
    );
    logger.info(`Successfullyupdated user details`);
    sendResponse(res, 200, "Successfully updated user details");
  } catch (e) {
    const m = `Error while fetching user details: ${e.message}`;
    logger.error(m);
    sendResponse(res, 500, m);
  }
};

module.exports = {
  uploadImgToS3,
  fetchUserDetails,
  updateUserDetails,
};
