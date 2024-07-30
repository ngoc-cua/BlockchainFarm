const express = require('express');
const router = express.Router();
const productFertilizingPesticideController = require('../controllers/productFertilizingPesticideController');

router.post('/create', productFertilizingPesticideController.create);

// router.get('/', productFertilizingPesticideController.getAll);

// router.get('/:id', productFertilizingPesticideController.getById);

// router.put('/:id', productFertilizingPesticideController.update);

// router.delete('/:id', productFertilizingPesticideController.delete);

module.exports = router;
