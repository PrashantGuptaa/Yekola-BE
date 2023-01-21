import express from "express";
import healthController from "../../controllers/health.controller";
import {
  loginUserController,
  registerUserController,
  getCheckUserAuthenticationController,
  updatePasswordController
} from "../../controllers/user.controller";
import { fetchAllRolesController } from "../../controllers/roles.controller";
import { fetchAllProductsController } from "../../controllers/products.controller";
import { listRoomsController } from "../../controllers/listRooms.controller";
import getShowCreateRoomBtnController from "../../controllers/getShowCreateRoomBtn.controller";
import { authenticate } from "../../middlewares/authenticate";
import { checkIfRoomEditAllowedMiddleware } from "../../middlewares/checkIfRoomEditAllowed.middleware";

const router = express.Router();

router.get("/", healthController);
router.get("/fetch-all-roles",authenticate, fetchAllRolesController);
router.get("/fetch-all-products",authenticate, fetchAllProductsController);
router.get("/list-rooms/:product",authenticate, listRoomsController);
router.get("/create-room-auth", authenticate, checkIfRoomEditAllowedMiddleware, getShowCreateRoomBtnController);

router.post("/login", loginUserController);
router.post("/register", registerUserController);
router.get('/user/validation/', authenticate, getCheckUserAuthenticationController);
router.post('/user/update-password', updatePasswordController);

export default router;
