const { Router } = require('express');
const router = Router();
const { abrirPanelRemoto, sincronizarLogsPanel } = require('../controllers/panels.controller.js');

// Ruta: POST /api/paneles/abrir
router.post('/abrir', abrirPanelRemoto);

// Ruta: POST /api/paneles/abrir
router.post('/Logs', sincronizarLogsPanel);

module.exports = router;