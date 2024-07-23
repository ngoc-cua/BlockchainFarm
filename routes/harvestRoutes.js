// routes/harvestRoutes.js
const express = require('express');
const router = express.Router();
const HarvestController = require('../controllers/harvestController'); // Updated controller import
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/harvest/create', authenticateJWT, HarvestController.createHarvest);
router.put('/harvest/:harvestId', authenticateJWT, HarvestController.updateHarvest);
router.patch('/harvest/:harvestId/toggle-status', authenticateJWT, HarvestController.toggleHarvestStatus);
router.get('/harvest/:productCode', authenticateJWT, HarvestController.getHarvestByProduct);

module.exports = router;
