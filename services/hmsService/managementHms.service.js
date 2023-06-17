import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import HttpServices from "../HttpServices/http.service.js";
import { extractUsefulRoomInformation } from "../../utils/utils.js";
import _ from "lodash";
import HmsRoomsModel from "../../Model/hmsRooms.Schema.js";
import HMS from "@100mslive/server-sdk";

const generateHmsManagementToken = () => {
  try {
    const HMS_APP_ACCESS_KEY = process.env.HMS_AUTH_ACCESS;
    const HMS_APP_SECRET_KEY = process.env.HMS_AUTH_SECRET;

    yekolaLogger.info(`Fetching Access Token for HMS-Mangement `);
    const accessToken = jwt.sign(
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
    console.log("Access Token", accessToken);
    yekolaLogger.info("Fetched Access Token for HMS");
    return accessToken;
  } catch (e) {
    yekolaLogger.info("Error while connecting HMS", e);
    throw new Error(e);
  }
};

export const createHmsRoomService = async (userRoomInfoObj, userName) => {
  try {
    const { name, description, product, startDateTime, endDateTime } =
      userRoomInfoObj;
    yekolaLogger.info(`Attempting to create HMS Room`, userRoomInfoObj);

    const {
      HMS_TEMPLATE_ID,
      HMS_REGION,
      HMS_AUTH_ACCESS,
      HMS_AUTH_SECRET
    } = process.env;

    const roomName = updatedRoomName(name);
    const roomDesciption = description || "";
    const data = {
      name: roomName,
      description: roomDesciption,
      template_id: HMS_TEMPLATE_ID,
      region: HMS_REGION,
      recording_info: null,
    };

    const hms = new HMS.SDK(HMS_AUTH_ACCESS, HMS_AUTH_SECRET);

    const roomWithOptions = await hms.rooms.create(data);
    console.log("Room with options", roomWithOptions);

    yekolaLogger.info(
      "Successfully created room in HMS Platform, Proceeding to save information in DB"
    );
    const { id: room_id, app_id } = roomWithOptions;

    const roomObj = {
      name: roomName,
      description: roomDesciption,
      roomId: room_id,
      appId: app_id,
      product,
      startDateTime,
      endDateTime,
      instructor: userName,
      lastUpdatedBy: userName,
      createdBy: userName,
    }

    const result = await HmsRoomsModel.collection.insertOne(roomObj);

    console.log("Result", result);

    yekolaLogger.info("Successfully created HMS Room - HMS Service");

    return roomObj;
  } catch (e) {
    console.error(e);
    yekolaLogger.error(`Error while creating HMS Room: ${e}`);
    throw new Error(e);
  }
};

export const listHmsRoomsService = async () => {
  try {
    yekolaLogger.info(`Fetching List of Rooms`);
    const {
      HMS_TEMPLATE_ID,
      HMS_REGION,
      HMS_AUTH_ACCESS,
      HMS_AUTH_SECRET
    } = process.env;

    const hms = new HMS.SDK(HMS_AUTH_ACCESS, HMS_AUTH_SECRET);
    // const response =  hms.rooms.(HMS_AUTH_ACCESS, HMS_AUTH_SECRET);

    const allSessionsIterable = hms.sessions.list();
    const roomList = [];
    // return allSessionsIterable;
for await (const session of allSessionsIterable) {
  // console.log(session);
  roomList.push(session);
  if (!allSessionsIterable.isNextCached) {
    console.log("the next loop is gonna take some time");
  }
}
// console.log(response , 'F-5');
    // const accessToken = generateHmsManagementToken();
    // const HMS_URL = process.env.HMS_URL;
    // const headers = {
    //   Authorization: `Bearer ${accessToken}`,
    // };
    // const response = await HttpServices.getRequest(HMS_URL, headers);

    yekolaLogger.info("Successfully fetched list of rooms - HMS Service");
    return roomList;
  } catch (e) {
    yekolaLogger.error(`Error while creating HMS Room: ${e}`);
    throw new Error(e);
  }
};

const updatedRoomName = (name = "Yekola Room") => name.replace(/ /g, "-");
// `${name?.split(" ").join("-")}`;
