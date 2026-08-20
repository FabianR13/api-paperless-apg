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
  getCompany,
  getAccess,
  saveTokenPush,
  enviarNotificacionPush,
  getUserSignature
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

// RUTA PARA OBTENER USUARIOS //
router.get("/Users/:CompanyId",
  verifyToken,
  isAutorized,
  getUsers);

///Route to create new user///
router.post(
  "/Signup/:CompanyId",
  [checkDuplicateUsernameorEmail],
  //for the first user disble (verifyToken, isAutorized and isAdmin)
  verifyToken,
  isAutorized,
  isAdmin,
  signUp
);

///Route to create a new Role///
router.post(
  "/NewRole/:CompanyId",
  verifyToken,
  isAdmin,
  checkDuplicateRole,
  newRole
);

///Route to update user///
router.put("/UpdateUser/:userId/:CompanyId",
  verifyToken,
  isAutorized,
  isAdmin,
  updateUser);

///Route to change user password///
router.put(
  "/ChangePassword/:userId",
  verifyToken,
  updatePassword
);

///Route to get all roles///
router.get("/Roles",
  verifyToken,
  getRoles);

///Route to get companies///
router.get("/Companies",
  verifyToken,
  getCompany);

///Route to login///
router.post("/Signin/:CompanyId",
  signIn);

///Route to have directory access///
router.post("/Access",
  getAccess);

///Route to get dashboard///
router.get("/Dashboard",
  verifyToken,
  getDashboardCards);

//guardar pushtoken
router.post("/tokenPush",
  saveTokenPush);

router.post(
  "/SendNotificacion",
  enviarNotificacionPush
);
router.get("/UserSignature/:userId", verifyToken, getUserSignature);

module.exports = router;
