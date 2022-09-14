const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const logoutController = require('../controllers/logoutController');
const refreshTokenController = require('../controllers/refreshTokenController');
const registerController = require('../controllers/registerController');

router.post('/register', registerController.handleNewUser);
router.post('/login', authController.handleLogin);
router.get('/refreshtoken', refreshTokenController.handleRefreshToken);
router.get('/logout', logoutController.handleLogout);
router.post('/resetpassword',registerController.handleResetPassword);

module.exports = router;