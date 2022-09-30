const {Router} = require("express");
const router = Router();
const {
    verifyToken,
    isAdmin
}= require("../middlewares/auth.Jwt.js");
const {
    checkRolesExisted
}= require("../middlewares/verifySignup.js");
const createUser = require("../controllers/user.controller.js");
// import * as userController from "../controllers/user.controller.js";
// import { authJwt, verifySignup } from "../middlewares/index.js";

router.post("/", [
    verifyToken,
    isAdmin,
    checkRolesExisted
], createUser);

module.exports = router;
