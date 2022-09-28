import { Router } from "express";
const router = Router();

import * as authController from "../controllers/auth.controller";
import { verifySignup, authJwt } from "../middlewares";

router.post(
  "/Signup/:CompanyId",
  [verifySignup.checkDuplicateUsernameorEmail],
  //for the first user disble (verifyToken, isAutorized and isAdmin)
  // authJwt.verifyToken,
  // authJwt.isAutorized,
  // authJwt.isAdmin,
  authController.signUp
);

router.post(
  "/NewRole/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAdmin,
  verifySignup.checkDuplicateRole,
  authController.newRole
);

router.put("/UpdateUser/:userId/:CompanyId",
authJwt.verifyToken, 
authJwt.isAutorized,
authJwt.isAdmin,
authController.updateUser);

router.put(
  "/ChangePassword/:userId",
  authJwt.verifyToken,
  authController.updatePassword
);

router.put(
  "/ChangeSignature/:userId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isAdmin,
  authController.updateUserSign
);

router.get("/Users/:CompanyId", 
authJwt.verifyToken, 
authJwt.isAutorized,
authController.getUsers);

router.get("/Roles", 
authJwt.verifyToken, 
authController.getRoles);

router.get("/Companies", 
authJwt.verifyToken, 
authController.getCompany);

router.post("/Signin/:CompanyId", 
authController.signIn);

router.get("/Dashboard", 
authJwt.verifyToken, 
authController.getDashboardCards);

export default router;
