const { get } = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
const { sendEmailService } = require("./emailService");
const {
  getOtpEmailSubject,
  getOtpEmailBody,
  generateOTP,
  generateToken,
  getResetPasswordEmailSubject,
  getResetPasswordEmailBody,
} = require("../utils/authUtils");
const { logger } = require("./logService");

const sendOtpService = async ({ userId, email, role, name }) => {
  try {
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 12);
    const validity = Date.now() + 5 * 60 * 1000; // 5 mins validity
    const finalOtp = `${hashedOtp}_${validity}`;

    const tempToken = generateToken(userId, email, role, false, name, "300s");

    await User.findByIdAndUpdate(userId, { otp: finalOtp });
    const startTime = Date.now();
    logger.info(`Sending Otp to email: ${email}`);
    await sendEmailService(
      email,
      getOtpEmailSubject(),
      getOtpEmailBody(tempToken, otp)
    );
    logger.info(
      `Successfully sent otp to: ${email}. Time taken: ${
        (Date.now() - startTime) / 1000
      }s`
    );
  } catch (e) {
    const m = `Error while sending otp: ${e.message}`;
    logger.error(m);
    throw new Error(m);
  }
};

const sendResetEmailService = async (email) => {
  try {
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 12);
    const validity = Date.now() + 5 * 60 * 1000; // 5 mins validity
    const resetPasswordOtp = `${hashedOtp}_${validity}`;

    await User.findOneAndUpdate({ email }, { $set: { resetPasswordOtp } });
    const startTime = Date.now();
    logger.info(`Sending reset passowrd Otp to email: ${email}`);
    await sendEmailService(
      email,
      getResetPasswordEmailSubject(),
      getResetPasswordEmailBody(otp)
    );
    logger.info(
      `Successfully sent reset passowrd otp to: ${email}. Time taken: ${
        (Date.now() - startTime) / 1000
      }s`
    );
  } catch (e) {
    const m = `Error while sending otp: ${e.message}`;
    logger.error(m);
    throw new Error(m);
  }
};

module.exports = {
  sendOtpService,
  sendResetEmailService,
};
