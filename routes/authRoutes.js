// authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // Import the auth controller
const authenticateUser = require("../middlewares/authMiddleware");

// Sign-Up Route
router.post("/signup", authController.signUp);

// Login Route
router.post("/login", authController.login);

// send otp Route
router.post("/send-otp", authController.sendOtpToUser);

// Verify OTP Route
router.post("/verify-otp", authController.verifyOtpFromUser);

// Verify OTP Route
router.patch("/update-role/:email", authenticateUser, authController.changeUserRole);

router.get("/validate", authenticateUser, authController.confirmUserAuthorization);

module.exports = router;
