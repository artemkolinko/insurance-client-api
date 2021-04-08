const express = require('express');
const router = express.Router();
const { authorize } = require('../_helpers/jwt');
const controller = require('../controller/clientController');
const Role = require('../_helpers/role');

// /api/v2/clients
router.route('/')
  .get(authorize(Role.Admin), controller.getClients)
  .post(authorize(), controller.addClient);

router.route('/:id')
  .get(authorize(), controller.getClient)
  .patch(authorize(), controller.editClient)
  .delete(authorize(Role.Admin), controller.deleteClient);

router
  .route('/:id/buy-package')
  .patch(authorize(), controller.buyPackageHandler);

router
  .route('/:id/topup-balance')
  .patch(authorize(), controller.topupBalanceHandler);

router
  .route('/:id/info')
  .get(authorize(), controller.getClientInfo);

module.exports = router;
