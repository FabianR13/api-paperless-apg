const { Router } = require('express');
const router = Router();
const {
    // Paneles
    getPaneles,
    crearPanel,
    updatePanel,
    deletePanel,
    updateDoorName,

    // Access Groups
    getAccessGroups,
    crearAccessGroup,
    updateAccessGroup,
    deleteAccessGroup,

    // Credentials
    getCredentials,

    // Logs
    getAccessLogsData,
    
    // Comandos Agente ZK
    borrarLogsPanel,
    abrirPanelRemoto,
    sincronizarLogsPanel,
    configurarHorarioPanel,
    enviarCredencialUnica,
    sincronizarTodoElPanel,
    eliminarCredencialUnica
} = require('../controllers/panels.controller.js');
const panelCtrl = require('../controllers/panels.controller');
const { verifyToken, isAutorized, isAdmin } = require('../middlewares/auth.Jwt.js');

// Paneles
router.get('/', getPaneles);
router.post('/', crearPanel);
router.put('/:id', updatePanel);
router.delete('/:id', deletePanel);


// Access Groups
router.get('/groups/:companyId', getAccessGroups);
router.post('/groups', crearAccessGroup);
router.put('/groups/:id', updateAccessGroup);
router.delete('/groups/:id', deleteAccessGroup);

// Credentials
router.get('/credentials/:companyId', getCredentials);

// Logs
router.get(
    "/AccessLogs/:CompanyId",
    verifyToken,
    isAutorized,
    getAccessLogsData
);

// Comandos Agente ZK
router.post('/abrir', abrirPanelRemoto);
router.post('/logs', sincronizarLogsPanel);
router.post('/borrar-logs', borrarLogsPanel);
router.post('/configurar-horario', configurarHorarioPanel);
router.post('/credencial', enviarCredencialUnica);
router.post('/sync-masiva', sincronizarTodoElPanel);
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