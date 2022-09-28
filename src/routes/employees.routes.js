import Router from "express";
const router = Router();

import * as employeesController from "../controllers/employees.controller";
import { verifySignup, authJwt } from "../middlewares";
import  uploadProfileImage  from "../middlewares/uploadProfileImg.js";

router.post(
    "/NewEmployee/:CompanyId",
    verifySignup.checkDuplicateEmployeeNo,
    authJwt.verifyToken,
    authJwt.isAutorized,
    authJwt.isModerator,
    uploadProfileImage,
    employeesController.signEmployee
);


// Route to get All the positions
router.get(
    "/Positions",
    employeesController.getPositions
  );

  // Route to get All the positions
router.get(
  "/Departments",
  employeesController.getDepartments
);

router.get(
  "/Employees/:CompanyId",
  employeesController.getEmployees
);


//update if employee have user 
router.put(
  "/UpdateEmployee/User/:employeeId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isAdmin,
  employeesController.updateEmployeeUser
);

//Update Employee
router.put(
  "/UpdateEmployee/:employeeId/:CompanyId",
  // verifySignup.checkDuplicateEmployeeNo,
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isModerator,
  employeesController.updateEmployee
);
//Update employe image
router.put(
  "/UpdateEmployee/Picture/:employeeId/:CompanyId",
  authJwt.verifyToken,
  authJwt.isAutorized,
  authJwt.isModerator,
  uploadProfileImage,
  employeesController.modifyProfileImg
);
export default router;