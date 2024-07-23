const express = require('express');
const router = express.Router();
const BoxingController = require('../controllers/boxingController');
const jwtAuth = require('../utils/authenticateJWT');

router.post('/boxing/create', jwtAuth, BoxingController.createBoxing);
router.put('/boxing/update/:id', jwtAuth, BoxingController.updateBoxing);
router.delete('/boxing/delete/:id', jwtAuth, BoxingController.deleteBoxing);
router.get('/boxing/all', jwtAuth, BoxingController.getAllBoxings);

module.exports = router;