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
const { verifyToken, isAutorized, isAdmin, isAccessPanelsM } = require('../middlewares/auth.Jwt.js');

// Paneles
router.get(
    '/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    getPaneles);

router.post(
    '/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    crearPanel);

router.put(
    '/:id/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    updatePanel);

router.delete(
    '/:id/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    deletePanel);


// Access Groups
router.get(
    '/groups/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    getAccessGroups);

router.post(
    '/groups/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    crearAccessGroup);

router.put(
    '/groups/:id/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    updateAccessGroup);

router.delete(
    '/groups/:id/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    deleteAccessGroup);

// Credentials
router.get(
    '/credentials/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    getCredentials);

// Logs
router.get(
    "/AccessLogs/:CompanyId",
    verifyToken,
    isAutorized,
    getAccessLogsData
);

// Comandos Agente ZK
router.post(
    '/abrir/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    abrirPanelRemoto);

router.post(
    '/logs/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    sincronizarLogsPanel);

router.post(
    '/borrar-logs/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    borrarLogsPanel);

router.post(
    '/configurar-horario/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    configurarHorarioPanel);

router.post(
    '/credencial/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    enviarCredencialUnica);

router.post(
    '/sync-masiva/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    sincronizarTodoElPanel);

router.post(
    '/eliminar-credencial/:CompanyId',
    verifyToken,
    isAutorized,
    isAccessPanelsM,
    eliminarCredencialUnica);

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