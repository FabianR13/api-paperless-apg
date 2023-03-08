const { Router } = require("express");
const router = Router();
const {
  checkDuplicateEmployeeNo
} = require("../middlewares/verifySignup.js");
const {
  verifyToken,
  isModerator,
  isAdmin,
  isAutorized
} = require("../middlewares/auth.Jwt.js");
const {
  signEmployee,
  getPositions,
  getDepartments,
  getEmployees,
  updateEmployeeUser,
  modifyProfileImg,
  updateEmployee
} = require("../controllers/employees.controller.js");
const uploadPicture = require("../middlewares/uploadProfileImg.js");

///Route to create new employee///
router.post(
  "/NewEmployee/:CompanyId",
  checkDuplicateEmployeeNo,
  verifyToken,
  isAutorized,
  isModerator,
  uploadPicture,
  signEmployee
);
///Route to get All the positions///
router.get(
  "/Positions",
  getPositions
);
/// Route to get All the departments///
router.get(
  "/Departments",
  getDepartments
);
///Route to get employees///
router.post(
  "/Employees/:CompanyId",
  getEmployees
);
///Route to update user field in employee///
router.put(
  "/UpdateEmployee/User/:employeeId/:CompanyId",
  verifyToken,
  isAutorized,
  isAdmin,
  updateEmployeeUser
);
///Route to update employee///
router.put(
  "/UpdateEmployee/:employeeId/:CompanyId",
  verifyToken,
  isAutorized,
  isModerator,
  updateEmployee
);
///Route to update picture of employee///
router.put(
  "/UpdateEmployee/Picture/:employeeId/:CompanyId",
  verifyToken,
  isAutorized,
  isModerator,
  uploadPicture,
  modifyProfileImg
);

module.exports = router;