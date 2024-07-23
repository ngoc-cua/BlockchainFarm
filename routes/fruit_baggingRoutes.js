const express = require('express');
const router = express.Router();
const FruitBaggingController = require('../controllers/fruit_baggingController'); 
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/fruit_bagging/create', authenticateJWT, FruitBaggingController.createFruitBagging); 
router.put('/fruit_bagging/:fruitBaggingId', authenticateJWT, FruitBaggingController.updateFruitBagging); 
router.patch('/fruit_bagging/:fruitBaggingId/toggle-status', authenticateJWT, FruitBaggingController.toggleFruitBaggingStatus); 
router.get('/fruit_bagging/:productCode', authenticateJWT, FruitBaggingController.getFruitBaggingByProduct); 

module.exports = router;
