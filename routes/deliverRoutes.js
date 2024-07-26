const express = require('express');
const router = express.Router();
const DeliverController = require('../controllers/deliverController');

router.post('/deliver/confirm', DeliverController.confirmDeliver);

module.exports = router;
