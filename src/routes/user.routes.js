import { Router } from "express";
const router = Router();

import * as userController from "../controllers/user.controller.js";
import { authJwt, verifySignup } from "../middlewares/index.js";

router.post("/", [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkRolesExisted
], userController.createUser);

module.exports = router;
