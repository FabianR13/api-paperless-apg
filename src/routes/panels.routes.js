const { Router } = require('express');
const router = Router();
const { abrirPanelRemoto, sincronizarLogsPanel, configurarHorarioPanel, enviarCredencialUnica,
    sincronizarTodoElPanel, eliminarCredencialUnica, getPaneles, crearPanel, getCredentials, getAccessGroups
} = require('../controllers/panels.controller.js');
const panelCtrl = require('../controllers/panels.controller');

// Ruta: POST /api/paneles/abrir
router.post('/abrir', abrirPanelRemoto);

// Ruta: POST /api/paneles/abrir
router.post('/logs', sincronizarLogsPanel);

const { verifyToken, isAutorized, isAdmin } = require('../middlewares/auth.Jwt.js');

router.get('/', panelCtrl.getPaneles);
router.get('/credentials/:companyId', getCredentials);
router.get('/groups/:companyId', getAccessGroups);
router.post('/', panelCtrl.crearPanel);

router.post('/configurar-horario', configurarHorarioPanel);
router.post('/credencial', enviarCredencialUnica);
router.post('/sync-masiva', sincronizarTodoElPanel)
router.post('/eliminar-credencial', eliminarCredencialUnica);

router.post(
    '/NewCredential/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    panelCtrl.createNewCredential
)

router.put(
    '/UpdateCredential/:CredentialId/:CompanyId',
    verifyToken,
    isAutorized,
    isAdmin,
    panelCtrl.updateCredential
)

module.exports = router;