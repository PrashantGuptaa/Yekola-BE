// authRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Import the auth controller
const authenticateUser = require("../middlewares/authMiddleware");

router.patch("/upload-image/:userId", userController.uploadImgToS3);
router.get("/:email", authenticateUser, userController.fetchUserDetails);
router.patch("/:userId", authenticateUser, userController.updateUserDetails);
router.get("/", authenticateUser, userController.searchUsers);

module.exports = router;
