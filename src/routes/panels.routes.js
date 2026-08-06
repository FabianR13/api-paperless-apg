const { Router } = require('express');
const router = Router();
const { abrirPanelRemoto, sincronizarLogsPanel } = require('../controllers/panels.controller.js');

// Ruta: POST /api/paneles/abrir
router.post('/abrir', abrirPanelRemoto);

// Ruta: POST /api/paneles/abrir
router.post('/logs', sincronizarLogsPanel);
const panelCtrl = require('../controllers/panels.controller');

router.get('/', panelCtrl.getPaneles);
router.post('/', panelCtrl.crearPanel);

module.exports = router;