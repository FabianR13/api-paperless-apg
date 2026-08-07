const { Router } = require('express');
const router = Router();

const {
    // Paneles
    getPaneles,
    crearPanel,
    updatePanel,
    deletePanel,

    // Access Groups
    getAccessGroups,
    crearAccessGroup,
    updateAccessGroup,
    deleteAccessGroup,

    // Credentials
    getCredentials,

    // Comandos Agente ZK
    abrirPanelRemoto,
    sincronizarLogsPanel,
    configurarHorarioPanel,
    enviarCredencialUnica,
    sincronizarTodoElPanel,
    eliminarCredencialUnica
} = require('../controllers/panels.controller.js');

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


// Comandos Agente ZK
router.post('/abrir', abrirPanelRemoto);
router.post('/logs', sincronizarLogsPanel);
router.post('/configurar-horario', configurarHorarioPanel);
router.post('/credencial', enviarCredencialUnica);
router.post('/sync-masiva', sincronizarTodoElPanel);
router.post('/eliminar-credencial', eliminarCredencialUnica);

module.exports = router;