const {
  Router
} = require("express");

const router = Router();

const {
  sendMessage,
  loginWhatsapp,
  logoutWhatsapp,
  createAutoAlertData,
  getAutoAlertData,
  updateAutoAlertData
} = require("../controllers/whatsapp.controller.js"); //Ruta iniciar sesion en whatsapp


router.post("/login", loginWhatsapp); //Enviar mensaje 

router.post("/sendMessage", sendMessage); //Cerrar sesion

router.post("/logout", logoutWhatsapp); //Crear autoalert

router.post("/AutoAlertData", createAutoAlertData); //Obtener autoalert

router.get("/GetAutoAlertData", getAutoAlertData); //Editar autoalert

router.put("/UpdateAutoAlertData/:alertId", updateAutoAlertData);
module.exports = router;