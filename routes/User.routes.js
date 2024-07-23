const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User.controller');

router.post('/register', UserController.register);
router.post('/verify', UserController.verify);
router.post('/resend-verification', UserController.resendVerification);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/change-password', UserController.changePassword);
router.put('/edit-user-info', UserController.editUserInfo);

module.exports = router;
