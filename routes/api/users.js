const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const observationsController = require('../../controllers/observationsController');
const subscriptionsController = require('../../controllers/subscriptionsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id/observations')
     .get(observationsController.getUserObservations)
//     .post(observationsController.createNewObservation)
//     .put(observationsController.updateObservation)
//     .delete(observationsController.deleteObservation);

// router.route('/:id/subscriptions')
//      .get(verifyRoles(ROLES_LIST.User), subscriptionsController.getUserSubscriptions)


router.route('/:id')
    .put(verifyRoles(ROLES_LIST.User), usersController.editUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.User), usersController.getUser);






module.exports = router;