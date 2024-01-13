const mongoose = require("mongoose");
const { LISTENER_ROLE, USER_ROLES } = require("../utils/roomConstants");

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 20
    },
    otp: {
      type: String,
    },
    resetPasswordOtp: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 50
    },
    bio: {
      type: String,
      maxLength: 200,
    },
    profilePhoto: String,
    nationality: {type: String, maxLength: 50},
    langaugesLearning: [String],
    langaugesLearnt: [String],
    role: {
      type: String,
      enum: [...USER_ROLES], // You can adjust the roles as needed
      default: LISTENER_ROLE,
    },
    active: {
      type: Boolean,
      default: false, // By default, the account is not activated
    },
  },
  {
    timestamps: true, // Enable timestamps (createdAt and updatedAt fields)
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
