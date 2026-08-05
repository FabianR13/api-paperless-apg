const { Router } = require('express');
const router = Router();
const panelCtrl = require('../controllers/panels.controller');

router.get('/', panelCtrl.getPaneles);
router.post('/', panelCtrl.crearPanel);

module.exports = router;