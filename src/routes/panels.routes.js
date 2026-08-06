const { Router } = require('express');
const router = Router();
const { abrirPanelRemoto, sincronizarLogsPanel, getPaneles, crearPanel, getCredentials, getAccessGroups } = require('../controllers/panels.controller.js');

// Ruta: POST /api/paneles/abrir
router.post('/abrir', abrirPanelRemoto);

// Ruta: POST /api/paneles/abrir
router.post('/logs', sincronizarLogsPanel);
const panelCtrl = require('../controllers/panels.controller');

router.get('/', panelCtrl.getPaneles);
router.get('/credentials/:companyId', getCredentials);
router.get('/groups/:companyId', getAccessGroups);
router.post('/', panelCtrl.crearPanel);

module.exports = router;