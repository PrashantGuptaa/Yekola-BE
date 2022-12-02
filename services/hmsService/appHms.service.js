import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

export const generateAppTokenHmsService = async (roomId, userId, role) => {
    try {
      const HMS_APP_ACCESS_KEY = process.env.HMS_AUTH_ACCESS;
      const HMS_APP_SECRET_KEY = process.env.HMS_AUTH_SECRET;
      langoLogger.info(`Genrating App token for room-id :${roomId}, email: ${userId}, role: ${role} `);
  
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
        jwtid: v4(),
      });
  
      return accessToken;
    } catch (e) {
      langoLogger.error(`Error while generating app token for HMS, ${e}`);
    }
  };