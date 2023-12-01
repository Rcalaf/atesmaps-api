const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController');

router.get('/version', authController.showVersion);
router.get('/ios-version', authController.showIosVersion);
router.get('/play-version', authController.showAndroidVersion);

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});



module.exports = router;