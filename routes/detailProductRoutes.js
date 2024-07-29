const express = require('express');
const { getProductDetails } = require('../controllers/detailproductController');
const authenticateToken = require('../utils/authenticateJWT');
const router = express.Router();

router.get('/product/:product_code', authenticateToken, getProductDetails);

module.exports = router;
