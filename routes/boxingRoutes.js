const express = require('express');
const router = express.Router();
const BoxingController = require('../controllers/boxingController');

router.post('/boxing/confirm', BoxingController.confirmBoxing);

module.exports = router;
