const express = require('express');
const router = express.Router();
const subscriptionsController = require('../../controllers/subscriptionsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor), subscriptionsController.getAllSubscriptions)
    
   // .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor), paymentsController.updatePayment)
   // .delete(verifyRoles(ROLES_LIST.User), paymentsController.deletePayment);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor),subscriptionsController.getSubscription);

router.route('/:id')
    .put(verifyRoles(ROLES_LIST.User), subscriptionsController.editSubscription);

router.route('/user/:id')
    //.get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor),paymentsController.getUserPayments)
    .post(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor), subscriptionsController.createNewSubscription);

module.exports = router;