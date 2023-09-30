const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    appId: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
    product: String,
    enabled: {
      type: Boolean,
      default: true,
    },
    startDateTime: Date,
    endDateTime: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  {
    timestamps: true, // Enable timestamps (createdAt and updatedAt fields)
  }
);

module.exports = mongoose.model("Room", roomSchema);
