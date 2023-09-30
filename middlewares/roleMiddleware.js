const { get } = require("lodash");
const { logger } = require("../services/logService");
const sendResponse = require("../utils/responseUtils");
const { ALLOWED_ROLES_FOR_ROOM_EDIT } = require("../utils/roomConstants");

function checkUserAllowedForEditEoom(req, res, next) {
  logger.info("Checking if user is allowed to create/edit rooms");
  const userRole = get(req, ["userData", "role"], "");

  // Check if the user's role is allowed
  if (ALLOWED_ROLES_FOR_ROOM_EDIT.includes(userRole)) {
  logger.info("User has sufficent previleges to create room");
    next(); // User has an allowed role, proceed to the next middleware or route
  } else {
  logger.info("User role is not allowed to create room");
    return sendResponse(res, 403, "Access denied. Insufficient privileges.");
  }
}

module.exports = { checkUserAllowedForEditEoom };
