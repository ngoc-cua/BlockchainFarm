const express = require('express');
const { getProduct } = require('../controllers/detailproductController');
const authenticateToken = require('../utils/authenticateJWT');
const router = express.Router();

router.get('/product/:product_code', authenticateToken, getProduct);

module.exports = router;
