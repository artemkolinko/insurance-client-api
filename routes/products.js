const express = require('express');
const router = express.Router();
const controller = require('../controller/catalogController');

router
  .route('/')
  .get(controller.getProducts);

module.exports = router;
