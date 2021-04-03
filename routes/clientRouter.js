const express = require('express');
const router = express.Router();
const { authorize } = require('../_helpers/jwt');
const errorHandler = require('../_helpers/error-handler');
const controller = require('../controller/clientController');
const Role = require('../_helpers/role');

router.route('/')
  .get(authorize(Role.Admin), errorHandler, controller.getClients);
// .post(authorize(Role.Admin), errorHandler, controller.addClient);

router.route('/:id')
  .get(authorize(), errorHandler, controller.getClient)
  .patch(authorize(), errorHandler, controller.editClient)
  .delete(authorize(Role.Admin), errorHandler, controller.deleteClient);

router
  .route('/:id/buy-package')
  .patch(authorize(), errorHandler, controller.buyPackageHandler);

router
  .route('/topup-balance')
  .post(authorize(), errorHandler, controller.topupBalance);

router
  .route('/:id/info')
  .get(authorize(), errorHandler, controller.getClientInfo);

module.exports = router;
