const express = require('express');
const router = express.Router();
const ShipmentController = require('../controllers/shipmentController');
const authenticateToken = require('../utils/authenticateJWT');

router.get('/', authenticateToken, ShipmentController.getAllShipments);
router.get('/:id', authenticateToken, ShipmentController.getShipmentById);
router.post('/create', authenticateToken, ShipmentController.createShipment);
router.put('/:id', authenticateToken, ShipmentController.updateShipment);
router.delete('/:id', authenticateToken, ShipmentController.deleteShipment);

module.exports = router;
