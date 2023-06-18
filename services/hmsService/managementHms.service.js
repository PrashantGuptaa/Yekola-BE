import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import HttpServices from "../HttpServices/http.service.js";
import { extractUsefulRoomInformation } from "../../utils/utils.js";
import _ from "lodash";
import HmsRoomsModel from "../../Model/hmsRooms.Schema.js";
import HMS from "@100mslive/server-sdk";

export const createHmsRoomService = async (userRoomInfoObj, userName) => {
  try {
    const { name, description, product, startDateTime, endDateTime } =
      userRoomInfoObj;
    yekolaLogger.info(`Attempting to create HMS Room`, userRoomInfoObj);

    const { HMS_TEMPLATE_ID, HMS_REGION, HMS_AUTH_ACCESS, HMS_AUTH_SECRET } =
      process.env;

    const roomName = updatedRoomName(name);
    const roomDesciption = description || "";
    const data = {
      name: roomName,
      description: roomDesciption,
      template_id: HMS_TEMPLATE_ID,
      region: HMS_REGION,
      recording_info: null,
    };

    const existingRoomsForUser = await HmsRoomsModel.findOne({
      owner: userName,
    });
    if (existingRoomsForUser) {
      yekolaLogger.info("Room exists for user, updating the existing room")
      // Update existing room details

      const roomObj = {
        name: roomName,
        description: roomDesciption,
        startDateTime,
        endDateTime,
        instructor: userName,
        lastUpdatedBy: userName,
        updatedAt: Date.now(),
      };
      await HmsRoomsModel.findOneAndUpdate(
        {
          userName,
        },
        roomObj
      );

      yekolaLogger.info("Successfully updated the existing room")

      return;
    }
    // if room not exists create new one

    const hms = new HMS.SDK(HMS_AUTH_ACCESS, HMS_AUTH_SECRET);

    const roomWithOptions = await hms.rooms.create(data);

    yekolaLogger.info(
      "Successfully created room in HMS Platform, Proceeding to save information in DB"
    );
    const { id: roomId, app_id } = roomWithOptions;

    const roomObj = {
      name: roomName,
      description: roomDesciption,
      roomId,
      appId: app_id,
      product,
      startDateTime,
      endDateTime,
      instructor: userName,
      lastUpdatedBy: userName,
      createdBy: userName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      owner: userName,
    };

     await HmsRoomsModel.collection.insertOne(roomObj);

    yekolaLogger.info("Successfully created HMS Room - HMS Service");

    return { error: false };
  } catch (e) {
    console.error(e);
    yekolaLogger.error(`Error while creating HMS Room: ${e}`);
    throw new Error(e);
  }
};

export const listHmsRoomsService = async () => {
  try {
    yekolaLogger.info(`Fetching List of Rooms`);
    const { HMS_TEMPLATE_ID, HMS_REGION, HMS_AUTH_ACCESS, HMS_AUTH_SECRET } =
      process.env;

    const hms = new HMS.SDK(HMS_AUTH_ACCESS, HMS_AUTH_SECRET);
    // const response =  hms.rooms.(HMS_AUTH_ACCESS, HMS_AUTH_SECRET);

    const allSessionsIterable = hms.sessions.list();
    const roomList = [];
    // return allSessionsIterable;
    for await (const session of allSessionsIterable) {
      roomList.push(session);
      if (!allSessionsIterable.isNextCached) {
        console.log("the next loop is gonna take some time");
      }
    }
    yekolaLogger.info("Successfully fetched list of rooms - HMS Service");
    return roomList;
  } catch (e) {
    yekolaLogger.error(`Error while creating HMS Room: ${e}`);
    throw new Error(e);
  }
};

const updatedRoomName = (name = "Yekola Room") => name.replace(/ /g, "-");
// `${name?.split(" ").join("-")}`;
