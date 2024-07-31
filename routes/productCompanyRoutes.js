const express = require('express');
const router = express.Router();
const productCompanyController = require('../controllers/productCompanyController');
const authenticateToken = require('../utils/authenticateJWT');

router.post('/create',authenticateToken, productCompanyController.createProductCompany);

router.get('/:id', authenticateToken, productCompanyController.getProductCompanyById);

router.put('/:id',authenticateToken, productCompanyController.updateProductCompany);

router.delete('/:id',authenticateToken, productCompanyController.deleteProductCompany);

module.exports = router;
