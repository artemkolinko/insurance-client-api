const express = require('express');
const router = express.Router();
const { authorize } = require('../_helpers/jwt');
const errorHandler = require('../_helpers/error-handler');
const controller = require('../controller/catalogController');

router.use(authorize(), errorHandler);

router
  .route('/products')
  .get(controller.getProducts);

router
  .route('/packages/base')
  .get(controller.getPackagesBase);

module.exports = router;
