// routes/pesticideRoutes.js
const express = require('express');
const router = express.Router();
const PesticideController = require('../controllers/pesticideController');
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/pesticide/create', authenticateJWT, PesticideController.createPesticide);
router.put('/pesticide/:pesticideId', authenticateJWT, PesticideController.updatePesticide);
router.patch('/pesticide/:pesticideId/toggle-status', authenticateJWT, PesticideController.togglePesticideStatus);
router.get('/pesticide/:productCode', authenticateJWT, PesticideController.getPesticideByProduct);

module.exports = router;
