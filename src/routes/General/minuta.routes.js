const { Router } = require("express");
const router = Router();
const { isAdmin, isAutorized, verifyToken } = require("../../middlewares/auth.Jwt");
const {
    createNewMinuta,
    getAllMinutas
} = require("../../controllers/Forms/General/minuta.controller");
const { getAllTasks } = require("../../controllers/Forms/General/tasks.controller");


//Ruta para subir nueva minuta
router.post(
    "/NewMinuta/:CompanyId",
    createNewMinuta
);

//Ruta para obtener todas las minutas
router.get(
    "/Minutas/:CompanyId",
    getAllMinutas
);

//Ruta para obtener todas las tareas
router.get(
    "/Tasks/:CompanyId",
    getAllTasks
);

module.exports = router;