const { types } = require('cassandra-driver');
const clientsDb = require('../models/Clients');
const { getProductsCost, createPackage } = require('../controller/catalogController');

const clientTable = process.env.DB_CLIENT_TABLE;

const selectById = table => `SELECT * FROM ${clientTable} WHERE id = ?;`;
// UPDATE clients SET balance = 10000.12 WHERE id = 76ebb3a0-87de-11eb-bb03-652bfc2b4dab;
const selectAll = table => `SELECT * FROM ${table};`;
const insert = table => `INSERT INTO ${table} (id, name, balance) VALUES (?, ?, ?);`;
const updateById = (table, field) => `UPDATE ${table} SET ${field} = ? WHERE id = ?;`;

const getClientById = (id, table = clientTable) => clientsDb.execute(selectById(table), [id], { prepare: true });
const updateClient = (id, balance, field, table = clientTable) => clientsDb.execute(updateById(table, field), [balance, id], { prepare: true });

const topupBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    const result = await getClientById(req.params.id);
    const client = result.rows[0];

    let { balance } = client;
    balance += amount;

    await updateClient(client.id, balance, 'balance');
    res.send({ balance });
  } catch (err) {
    if (!req.body.amount || req.body.amount <= 0) {
      res.sendStatus(400);
    } else {
      res.status(500).send(err);
    }
  }
};

const buyPackage = async (req, res) => {
  let diff = null;
  if (!req.body.ids) {
    return res.sendStatus(400);
  }

  try {
    const { ids } = req.body;
    const result = await getClientById(req.params.id);
    const client = result.rows[0];
    let response = await getProductsCost({ ids });
    let data = await response.data;
    diff = client.balance - data.cost;
    if (diff < 0 || !diff) { throw new Error('Not enought balance'); }
    response = await createPackage({ ids });
    data = await response.data;
    const packageId = data.id;
    console.log(packageId);
    await updateClient(client.id, packageId, 'package');
    res.send(data);
  } catch (err) {
    if (diff < 0 || !diff) {
      res.status(402).json({ error: err.message });
    } else {
      res.status(404).json({ error: err.message });
    }
  }
};

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

module.exports = { topupBalance, buyPackage, getClients, addClient, editClient, getClient, deleteClient };
