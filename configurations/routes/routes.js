import express from "express";
import healthController from "../../controllers/health.controller.js";
import {
  loginUserController,
  registerUserController,
  getCheckUserAuthenticationController,
  updatePasswordController,
  updateUserRoleController
} from "../../controllers/user.controller.js";
import { fetchAllProductsController } from "../../controllers/products.controller.js";
import { listRoomsController } from "../../controllers/listRooms.controller.js";
import getShowCreateRoomBtnController from "../../controllers/getShowCreateRoomBtn.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { checkIfRoomEditAllowedMiddleware } from "../../middlewares/checkIfRoomEditAllowed.middleware.js";

const router = express.Router();

router.get("/", healthController);
router.get('/test', (req, res) => res.status(200).json("Test route is success"));
router.get("/fetch-all-products",authenticate, fetchAllProductsController);
router.get("/list-rooms/:product",authenticate, listRoomsController);
router.get("/create-room-auth", authenticate, checkIfRoomEditAllowedMiddleware, getShowCreateRoomBtnController);

router.post("/login", loginUserController);
router.post("/register", registerUserController);
router.get('/user/validation/', authenticate, getCheckUserAuthenticationController);
router.post('/user/update-password', updatePasswordController);
router.post('/user/update-role',authenticate, updateUserRoleController);
export default router;
