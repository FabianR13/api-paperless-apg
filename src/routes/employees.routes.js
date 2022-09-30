const {Router} =require("express");
const router = Router();
const {
  checkDuplicateEmployeeNo
} = require ("../middlewares/verifySignup.js");
const {
  verifyToken,
  isModerator,
  isAdmin,
  isAutorized
}= require ("../middlewares/auth.Jwt.js");
const {
  signEmployee,
  getPositions,
  getDepartments,
  getEmployees,
  updateEmployeeUser,
  modifyProfileImg
} = require("../controllers/employees.controller.js");
const uploadProfileImage = require("../middlewares/uploadProfileImg.js");
// import Router from "express";
// import * as employeesController from "../controllers/employees.controller.js";
// import { verifySignup, authJwt } from "../middlewares/index.js";
// import  uploadProfileImage  from "../middlewares/uploadProfileImg.js";

router.post(
    "/NewEmployee/:CompanyId",
    checkDuplicateEmployeeNo,
    verifyToken,
    isAutorized,
    isModerator,
    uploadProfileImage,
    signEmployee
);


// Route to get All the positions
router.get(
    "/Positions",
    getPositions
  );

  // Route to get All the positions
router.get(
  "/Departments",
  getDepartments
);

router.get(
  "/Employees/:CompanyId",
  getEmployees
);


//update if employee have user 
router.put(
  "/UpdateEmployee/User/:employeeId/:CompanyId",
  verifyToken,
  isAutorized,
  isAdmin,
  updateEmployeeUser
);

//Update Employee
router.put(
  "/UpdateEmployee/:employeeId/:CompanyId",
  // verifySignup.checkDuplicateEmployeeNo,
  verifyToken,
  isAutorized,
  isModerator,
  updateEmployee
);
//Update employe image
router.put(
  "/UpdateEmployee/Picture/:employeeId/:CompanyId",
  verifyToken,
  isAutorized,
  isModerator,
  uploadProfileImage,
  modifyProfileImg
);


module.exports = router;