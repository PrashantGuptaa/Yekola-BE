import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import axios from "axios";

const connectHms = async () => {
  try {
    const HMS_APP_ACCESS_KEY = process.env.HMS_AUTH_ACCESS;
    const HMS_APP_SECRET_KEY = process.env.HMS_AUTH_SECRET;
    langoLogger.info(`Fetching Access Token for HMS `);
    const accessToken = await jwt.sign(
      {
        access_key: HMS_APP_ACCESS_KEY,
        type: "management",
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
      },
      HMS_APP_SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "180",
        jwtid: v4(),
      }
    );
    langoLogger.info("Fetched Access Token for HMS");
    return accessToken;
  } catch (e) {
    langoLogger.info("Error while connecting HMS", e);
    throw new Error(e);
  }
};

export const createHmsRoomService = async (name, description) => {
  try {
    const HMS_URL = process.env.HMS_URL;
    const TEMPLATE_ID = process.env.HMS_TEMPLATE_ID;
    const HMS_REGION = process.env.HMS_REGION;
    const roomName = `${name || "Lango-rooms"}-${v4()}`;
    const roomDesciption = description || "Default-Description";
    var data = JSON.stringify({
      name: roomName,
      description: roomDesciption,
      template_id: TEMPLATE_ID,
      region: HMS_REGION,
    });

    const accessToken = await connectHms();

    var config = {
      method: "post",
      url: HMS_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    };

    const response = await axios(config);
    return response.data;
  } catch (e) {
    langoLogger.error(`Error while creating HMS Room: ${e}`);
    throw new Error(e);
  }
};

export const generateAppTokenHmsService = async (roomId, userId, role) => {
  try {
    const HMS_URL = process.env.HMS_URL;
    const TEMPLATE_ID = process.env.HMS_TEMPLATE_ID;
    const HMS_REGION = process.env.HMS_REGION;
    const HMS_APP_ACCESS_KEY = process.env.HMS_AUTH_ACCESS;
    const HMS_APP_SECRET_KEY = process.env.HMS_AUTH_SECRET;

    const payload = {
      access_key: HMS_APP_ACCESS_KEY,
      room_id: roomId,
      user_id: userId,
      role,
      type: "app",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };

    const accessToken = await jwt.sign(payload, HMS_APP_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "1h",
      jwtid: uuid4(),
    });

    return accessToken;
  } catch (e) {
    langoLogger.error(`Error while generating app token for HMS, ${e}`);
  }
};
