const { Router } = require('express');
const router = Router();
const { abrirPanelRemoto, sincronizarLogsPanel, configurarHorarioPanel, enviarCredencialUnica,
    sincronizarTodoElPanel,eliminarCredencialUnica
} = require('../controllers/panels.controller.js');

// Ruta: POST /api/paneles/abrir
router.post('/abrir', abrirPanelRemoto);

// Ruta: POST /api/paneles/abrir
router.post('/logs', sincronizarLogsPanel);
const panelCtrl = require('../controllers/panels.controller');

router.get('/', panelCtrl.getPaneles);
router.post('/', panelCtrl.crearPanel);

router.post('/configurar-horario', configurarHorarioPanel);
router.post('/credencial', enviarCredencialUnica);
router.post('/sync-masiva', sincronizarTodoElPanel)
router.post('/eliminar-credencial', eliminarCredencialUnica);

module.exports = router;