import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import axios from "axios";
import HttpServices from "../HttpServices/http.service";
import { addRoomInformationToDb } from "../../Model/yekola.db";
import { extractUsefulRoomInformation } from "../../utils/utils";

const generateHmsManagementToken = async () => {
  try {
    const HMS_APP_ACCESS_KEY = process.env.HMS_AUTH_ACCESS;
    const HMS_APP_SECRET_KEY = process.env.HMS_AUTH_SECRET;
    yekolaLogger.info(`Fetching Access Token for HMS-Mangement `);
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
    yekolaLogger.info("Fetched Access Token for HMS");
    return accessToken;
  } catch (e) {
    yekolaLogger.info("Error while connecting HMS", e);
    throw new Error(e);
  }
};

export const createHmsRoomService = async (
  name,
  description,
  product,
  userName
) => {
  try {
    yekolaLogger.info("Attempting to create HMS Room");
    const HMS_URL = process.env.HMS_URL;
    const TEMPLATE_ID = process.env.HMS_TEMPLATE_ID;
    const HMS_REGION = process.env.HMS_REGION;
    const roomName = `${name || "Yekola_rooms"}_${v4()}`;
    const roomDesciption = description || "";
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
    const { id: room_id, app_id } = response.data;
    const result = await addRoomInformationToDb(
      roomName,
      roomDesciption,
      room_id,
      app_id,
      product,
      userName
    );
    const roomObj = extractUsefulRoomInformation(result[0]);
    yekolaLogger.info("Successfully created HMS Room - HMS Service");

    return roomObj;
  } catch (e) {
    console.error(e);
    yekolaLogger.error(
      `Error while creating HMS Room`,
      e.name,
      e.message,
      e.cause
    );
    throw new Error(e);
  }
};

export const listHmsRoomsService = async () => {
  try {
    yekolaLogger.info(`Fetching List of Rooms`);
    const accessToken = await generateHmsManagementToken();
    const HMS_URL = process.env.HMS_URL;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await HttpServices.getRequest(HMS_URL, headers);

    yekolaLogger.info("Successfully fetched list of rooms - HMS Service");
    return response.data;
  } catch (e) {
    yekolaLogger.error(`Error while creating HMS Room: ${e}`);
    throw new Error(e);
  }
};
