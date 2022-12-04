import express from "express";
import healthController from "../../controllers/health.controller";
import {
  loginUserController,
  registerUserController,
} from "../../controllers/user.controller";
import { fetchAllRolesController } from "../../controllers/roles.controller";
import { fetchAllProductsController } from "../../controllers/products.controller";

const router = express.Router();

router.get("/", healthController);
router.get("/fetch-all-roles", fetchAllRolesController);
router.get("/fetch-all-products", fetchAllProductsController);

router.post("/login", loginUserController);
router.post("/register", registerUserController);

export default router;
