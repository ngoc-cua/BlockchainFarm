const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/Product.controller');
const authenticateJWT = require('../utils/authenticateJWT');

// POST /api/areas - Create a new area
router.use(authenticateJWT,)
// Route to create a product
router.post('/:areaId/create', ProductController.createProduct);
router.put('/edit/:productId', ProductController.updateProduct);
router.patch('/:productId/status', ProductController.toggleProductStatus);

module.exports = router;