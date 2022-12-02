import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import axios from "axios";
import HttpServices from "../HttpServices/http.service";

const generateHmsManagementToken = async () => {
  try {
    const HMS_APP_ACCESS_KEY = process.env.HMS_AUTH_ACCESS;
    const HMS_APP_SECRET_KEY = process.env.HMS_AUTH_SECRET;
    langoLogger.info(`Fetching Access Token for HMS-Mangement `);
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
    langoLogger.info("Attempting to create HMS Room");
    const HMS_URL = process.env.HMS_URL;
    const TEMPLATE_ID = process.env.HMS_TEMPLATE_ID;
    const HMS_REGION = process.env.HMS_REGION;
    const roomName = `${name || "Lango-rooms"}-${v4()}`;
    const roomDesciption = description || "Default-Description";
    const data = JSON.stringify({
      name: roomName,
      description: roomDesciption,
      template_id: TEMPLATE_ID,
      region: HMS_REGION,
    });

    const accessToken = await generateHmsManagementToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await HttpServices.postRequest(HMS_URL, data, headers);
    langoLogger.info("Successfully created HMS Room - HMS Service");
    return response.data;
  } catch (e) {
    langoLogger.error(`Error while creating HMS Room: ${e.message}`);
    throw new Error(e);
  }
};

export const listHmsRoomsService = async () => {
  try {
    langoLogger.info(`Fetching List of Rooms`);
    const accessToken = await generateHmsManagementToken();
    const HMS_URL = process.env.HMS_URL;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await HttpServices.getRequest(HMS_URL, headers);

    langoLogger.info("Successfully fetched list of rooms - HMS Service");
    return response.data;
  } catch (e) {
    langoLogger.error(`Error while creating HMS Room: ${e}`);
    throw new Error(e);
  }
};
