const express = require('express');
const router = express.Router();
const observationsController = require('../../controllers/observationsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(observationsController.getAllObservations)
    .post(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor), observationsController.createNewObservation)
    .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor), observationsController.updateObservation)
    .delete(verifyRoles(ROLES_LIST.User), observationsController.deleteObservation);

router.route('/:id')
    .get(observationsController.getObservation);

router.route('/user/:id')
    .get(observationsController.getUserObservations);

module.exports = router;