const { types } = require('cassandra-driver');
const clientsDb = require('../models/Clients');

const clientTable = process.env.DB_CLIENT_TABLE;

const selectAll = (table) => `SELECT * FROM ${table}`;
const insert = (table) =>
  `INSERT INTO ${table} (id, name, balance) VALUES (?, ?, ?)`;

const getClients = (req, res) => {
  clientsDb
    .execute(selectAll(clientTable))
    .then((result) => res.status(201).send(result.rows))
    .catch((err) => res.status(500).json({ err }));
};

const addClient = (req, res) => {
  const id = types.timeuuid();
  const { name } = req.body;
  const balance = 0;
  const params = [id, name, balance];
  clientsDb
    .execute(insert(clientTable), params, { prepare: true })
    .then(() => res.status(201).json({ id }))
    .catch((err) => res.status(500).json(err));
};

module.exports = { getClients, addClient };
