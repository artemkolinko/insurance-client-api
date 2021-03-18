const express = require('express');
const router = express.Router();
const Clients = require('../models/Clients');
const database = new Clients();

/* GET list of Clients */
router.get('/', async (req, res) => {
  const list = await database.getClientsList();
  res.send(list);
});

router.post('/', async (req, res) => {
  const clientId = await database.addClient(req.body.name);
  res.status(201).json({ clientId });
});

module.exports = router;
