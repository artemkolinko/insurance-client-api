const express = require('express');
const router = express.Router();
const controller = require('../controller/clientController');

router.route('/')
  .get(controller.getAll)
  .post(controller.addClient);

module.exports = router;
