const express = require('express');
const router = express.Router();
const SowController = require('../controllers/sowController'); 
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/sow/create', authenticateJWT, SowController.createSow); 
router.put('/sow/:sowId', authenticateJWT, SowController.updateSow); 
router.patch('/sow/:sowId/toggle-status', authenticateJWT, SowController.toggleSowStatus); 
router.get('/sow/:productCode', authenticateJWT, SowController.getSowByProduct); 

module.exports = router;
