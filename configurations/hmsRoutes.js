import express from 'express';
// import generateAccessTokenForHms from './../controllers/hmsControllers/generateAuthToken.controller.hms';
import createHmsRoomsController from './../controllers/hmsControllers/createHmsRooms.hms.controller';

const hmsRouter = express.Router();

// hmsRouter.get('/token', generateAccessTokenForHms);
hmsRouter.post('/create-rooms', createHmsRoomsController);

export default hmsRouter;
