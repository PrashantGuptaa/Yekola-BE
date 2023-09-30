const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

// A service class for Token generation and management
class TokenService {
  static #app_access_key = process.env.HMS_AUTH_ACCESS;
  static #app_secret = process.env.HMS_AUTH_SECRET;
  #managementToken;
  constructor() {
    this.#managementToken = this.getManagementToken(true);
  }

  // A private method that uses JWT to sign the payload with APP_SECRET
  #signPayloadToToken(payload) {
    const token = jwt.sign(payload, TokenService.#app_secret, {
      algorithm: "HS256",
      expiresIn: "24h",
      jwtid: v4(),
    });
    return token;
  }

  // A private method to check if a JWT token has expired or going to expire soon
  #isTokenExpired(token) {
    try {
      const { exp } = jwt.decode(token);
      const buffer = 30; // generate new if it's going to expire soon
      const currTimeSeconds = Math.floor(Date.now() / 1000);
      return !exp || exp + buffer < currTimeSeconds;
    } catch (err) {
      console.log("error in decoding token", err);
      return true;
    }
  }

  // Generate new Management token, if expired or forced
  getManagementToken(forceNew) {
    if (forceNew || this.#isTokenExpired(this.#managementToken)) {
      const payload = {
        access_key: TokenService.#app_access_key,
        type: "management",
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
      };
      this.#managementToken = this.#signPayloadToToken(payload);
    }
    return this.#managementToken;
  }

  // Generate new Auth token for a peer
  getAuthToken({ room_id, user_id, role }) {
    const payload = {
      access_key: TokenService.#app_access_key,
      room_id,
      user_id,
      role,
      type: "app",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };
    return this.#signPayloadToToken(payload);
  }
}

module.exports = { TokenService };
