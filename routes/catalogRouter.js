const express = require('express');
const router = express.Router();
const controller = require('../controller/catalogController');

router
  .route('/products')
  .get(controller.getProducts);

router
  .route('/packages/base')
  .get(controller.getPackagesBase);

module.exports = router;
