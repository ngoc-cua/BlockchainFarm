const express = require('express');
const router = express.Router();
const RetailerController = require('../controllers/retailerController'); 
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/retailer/confirm', authenticateJWT, RetailerController.confirmRetailer); 
module.exports = router;
