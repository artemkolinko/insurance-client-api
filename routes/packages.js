const express = require('express');
const router = express.Router();
const controller = require('../controller/catalogController');

router
  .route('/base')
  .get(controller.getPackages);

router
  .route('/:id/info')
  .get(controller.getPackageInfo);

module.exports = router;
