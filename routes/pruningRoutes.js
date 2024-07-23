// routes/pruningRoutes.js
const express = require('express');
const router = express.Router();
const PruningController = require('../controllers/pruningController');
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/pruning/create', authenticateJWT, PruningController.createPruning);
router.put('/pruning/:pruningId', authenticateJWT, PruningController.updatePruning);
router.patch('/pruning/:pruningId/toggle-status', authenticateJWT, PruningController.togglePruningStatus);
router.get('/pruning/:productCode', authenticateJWT, PruningController.getPruningByProduct);

module.exports = router;
