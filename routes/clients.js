const express = require('express');
const router = express.Router();
const controller = require('../controller/clientController');

router.route('/').get(controller.getClients).post(controller.addClient);

router
  .route('/:id')
  // .get(controller.getClient);
  .patch(controller.editClient);

module.exports = router;
