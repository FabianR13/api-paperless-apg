const {
  Router
} = require("express");

const router = Router();

const {
  verifyToken,
  isAdmin
} = require("../middlewares/auth.Jwt.js");

const createUser = require("../controllers/user.controller.js");

router.post("/", [verifyToken, isAdmin], createUser);
module.exports = router;