// routes/fertilizingRoutes.js
const express = require('express');
const router = express.Router();
const FertilizingController = require('../controllers/fertilizingController'); // Updated controller import
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/fertilizing/create', authenticateJWT, FertilizingController.createFertilizing);
router.put('/fertilizing/:fertilizingId', authenticateJWT, FertilizingController.updateFertilizing);
router.patch('/fertilizing/:fertilizingId/toggle-status', authenticateJWT, FertilizingController.toggleFertilizingStatus);
router.get('/fertilizing/:productCode', authenticateJWT, FertilizingController.getFertilizingByProduct);

module.exports = router;
