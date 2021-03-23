const express = require('express');
const router = express.Router();
const controller = require('../controller/clientController');

router.route('/')
  .get(controller.getClients)
  .post(controller.addClient);

router.route('/:id')
  .get(controller.getClient)
  .patch(controller.editClient)
  .delete(controller.deleteClient);

router
  .route('/:id/buy-package')
  .patch(controller.buyPackageHandler);

router
  .route('/:id/topup-balance')
  .patch(controller.topupBalance);

router
  .route('/:id/info')
  .get(controller.getClientInfo);

module.exports = router;
