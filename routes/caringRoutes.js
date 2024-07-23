// routes/harvestRoutes.js
const express = require('express');
const router = express.Router();
const CaringController = require('../controllers/caringController'); // Updated controller import
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/caring/create', authenticateJWT, CaringController.createCaring);
router.put('/caring/:caringId', authenticateJWT, CaringController.updateCaring);
router.patch('/caring/:caringId/toggle-status', authenticateJWT, CaringController.toggleCaringStatus);
router.get('/caring/:productCode', authenticateJWT, CaringController.getCaringByProduct);

module.exports = router;
