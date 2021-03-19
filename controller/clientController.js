const { types } = require('cassandra-driver');
const clientsDb = require('../models/Clients');

const clientTable = process.env.DB_CLIENT_TABLE;

const selectAll = (table) => `SELECT * FROM ${table}`;
const insert = (table) =>
  `INSERT INTO ${table} (id, name, balance) VALUES (?, ?, ?)`;

const getClients = (req, res) => {
  clientsDb
    .execute(selectAll(clientTable))
    .then((result) => res.status(200).send(result.rows))
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
    .catch((err) => res.status(500).json({ err }));
};

const getClient = (req, res) => {
  const getClientById = `SELECT * FROM ${clientTable} WHERE id = ?`;

  clientsDb
    .execute(getClientById, [req.params.id], { prepare: true })
    .then((result) => {
      res.status(200).json(result.rows[0]);
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
};

const editClient = (req, res) => {
  const { id } = req.params;
  // get client new name
  const { name } = req.body;

  const editClientName = `UPDATE ${clientTable} SET name = ? WHERE id = ?`;
  const params = [name, id];
  clientsDb
    .execute(editClientName, params, { prepare: true })
    .then(() => {
      res.status(200).json({ msg: 'Client name changed!' });
    })
    .catch((err) => res.status(500).json({ err }));
};

const deleteClient = (req, res) => {
  const { id } = req.params;
  const deleteClientById = `DELETE FROM ${clientTable} WHERE id = ?`;

  clientsDb
    .execute(deleteClientById, [id], { prepare: true })
    .then(() => {
      res.status(200).json({
        msg: 'Client saccessfuly deleted!'
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

module.exports = { getClients, addClient, editClient, getClient, deleteClient };
