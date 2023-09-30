// authMiddleware.js
const jwt = require("jsonwebtoken");
const httpContext = require("express-http-context");

const User = require("../Model/userModel");
const sendResponse = require("../utils/responseUtils");
const { setUserContext } = require("../services/logService");

require("dotenv").config(); // Load environment variables from .env

function authenticateUser(req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return sendResponse(res, 401, "Authentication failed. Token is missing.");
  }

  // Verify the token
  jwt.verify(token, process.env.AUTH_TOKEN, async (err, user) => {
    if (err) {
      return sendResponse(res, 401, "Authentication failed. Invalid token.");
    }

    if (!user || !user.active) {
      return sendResponse(
        res,
        401,
        "Authentication failed. Account not activated."
      );
    }

    // Attach the user's decoded token data to the request object for use in subsequent middleware/routes
    req.userData = user;
    setUserContext(user);

    // Proceed to the next middleware/route
    next();
  });
}

module.exports = authenticateUser;
