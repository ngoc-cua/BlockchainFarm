// routes/wateringRoutes.js
const express = require('express');
const router = express.Router();
const WateringController = require('../controllers/wateringController');
const authenticateJWT = require('../utils/authenticateJWT');
router.post('/watering/create', authenticateJWT, WateringController.createWatering);
router.put('/watering/:wateringId', authenticateJWT, WateringController.updateWatering);
router.patch('/watering/:wateringId/toggle-status', authenticateJWT, WateringController.toggleWateringStatus);
router.get('/watering/:productCode', authenticateJWT, WateringController.getWateringByProduct);

module.exports = router;
