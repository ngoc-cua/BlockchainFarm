const express = require('express');
const { getProduct } = require('../controllers/detailproductController');
const authenticateToken = require('../utils/authenticateJWT');
const router = express.Router();

router.get('/detailProduct', authenticateToken, getProduct);

module.exports = router;
