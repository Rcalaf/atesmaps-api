const express = require('express');
const router = express.Router();
const observationsController = require('../controllers/observationsController');

router.get('/', observationsController.getFeatures);


module.exports = router;