const {
  Router
} = require("express");

const router = Router();

const {
  isAdmin,
  isAutorized,
  verifyToken,
  isCreateMinuta
} = require("../../middlewares/auth.Jwt");

const {
  createNewMinuta,
  getAllMinutas,
  updateMinuta
} = require("../../controllers/Forms/General/minuta.controller");

const {
  getAllTasks,
  createNewTask,
  updateTaskById
} = require("../../controllers/Forms/General/tasks.controller"); //Ruta para subir nueva minuta


router.post("/NewMinuta/:CompanyId", verifyToken, isAutorized, isCreateMinuta, createNewMinuta); //Ruta para obtener todas las minutas

router.get("/Minutas/:CompanyId", verifyToken, isAutorized, isCreateMinuta, getAllMinutas); //Ruta para obtener todas las tareas

router.get("/Tasks/:CompanyId", verifyToken, isAutorized, isCreateMinuta, getAllTasks); //Ruta para actualizar minuta

router.put('/UpdateMinuta/:MinutaId/:CompanyId', verifyToken, isAutorized, isCreateMinuta, updateMinuta); //Ruta para subir nueva tarea

router.post("/NewTask/:MinutaId/:CompanyId", verifyToken, isAutorized, isCreateMinuta, createNewTask); //Ruta para subir nueva tarea

router.put("/UpdateTask/:TaskId/:CompanyId", verifyToken, isAutorized, isCreateMinuta, updateTaskById);
module.exports = router;