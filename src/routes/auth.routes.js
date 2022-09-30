const { Router } = require("express");
const router = Router();
const {
  signUp,
  newRole,
  signIn,
  getDashboardCards,
  getUsers,
  getRoles,
  updateUser,
  updatePassword,
  updateUserSign,
  getCompany
} = require("../controllers/auth.controller.js");
const {
  checkDuplicateUsernameorEmail,
  checkDuplicateRole
} = require("../middlewares/verifySignup.js");
const {
  verifyToken,
  isAdmin,
  isAutorized
} = require("../middlewares/auth.Jwt.js");
// import { Router } from "express";
// import * as authController from "../controllers/auth.controller.js";
// import { verifySignup, authJwt } from "../middlewares/index.js";

router.post(
  "/Signup/:CompanyId",
  [checkDuplicateUsernameorEmail],
  //for the first user disble (verifyToken, isAutorized and isAdmin)
  verifyToken,
  isAutorized,
  isAdmin,
  signUp
);

router.post(
  "/NewRole/:CompanyId",
  verifyToken,
  isAdmin,
  checkDuplicateRole,
  newRole
);

router.put("/UpdateUser/:userId/:CompanyId",
verifyToken, 
isAutorized,
isAdmin,
updateUser);

router.put(
  "/ChangePassword/:userId",
  verifyToken,
  updatePassword
);

router.put(
  "/ChangeSignature/:userId/:CompanyId",
  verifyToken,
  isAutorized,
  isAdmin,
  updateUserSign
);

router.get("/Users/:CompanyId", 
verifyToken, 
isAutorized,
getUsers);

router.get("/Roles", 
verifyToken, 
getRoles);

router.get("/Companies", 
verifyToken, 
getCompany);

router.post("/Signin/:CompanyId", 
signIn);

router.get("/Dashboard", 
verifyToken, 
getDashboardCards);

module.exports = router;
