const { types } = require('cassandra-driver');
const { clients, insert, selectAll, selectByName, getClientById, updateClient, deleteById } = require('../models/Clients');
const services = require('../services/clientServices');

const topupBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    const result = await getClientById(req.params.id);
    const client = result.rows[0];

    let { balance } = client;
    balance = balance + amount;

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

const buyPackageHandler = async (req, res) => {
  let errStatus = 400;
  try {
    if (!req.body.ids) {
      throw new Error('Parametr "ids" is null or not exist');
    }
    const result = await services.buyPackage(req.params.id, req.body.ids);
    if (result.error) {
      errStatus = result.errStatus;
      throw new Error(result.error.message);
    }
    res.send({ packageId: result.packageId });
  } catch (err) {
    res.status(errStatus).json({ error: err.message });
  }
};

const getClientInfo = async (req, res) => {
  let errStatus = 500;
  console.log('getClientInfo');
  try {
    if (!req.params.id) {
      errStatus = 400;
      throw new Error('Path parametr {id} incorrect or not exists');
    }

    const { id } = req.params;
    console.log('client id', id);
    const result = await services.clientInfo(id);

    if (result.error) {
      throw new Error(result.error.message);
    }

    res.status(200).send(result.data);
  } catch (err) {
    res.status(errStatus).send({ error: err.massage });
  }
};

const getClients = (req, res) => {
  // Get name from query string
  const name = req.query.name ? req.query.name.trim() : null;
  if (name) {
    // SELECT * FROM developers WHERE name = 'name' ALLOW FILTERING;
    clients
      .execute(selectByName(name))
      .then((result) => res.status(200).send(result.rows))
      .catch((err) => res.status(500).json({ err }));
  } else {
    clients
      .execute(selectAll())
      .then((result) => res.status(200).send(result.rows))
      .catch((err) => res.status(500).json({ err }));
  }
};

const addClient = (req, res) => {
  const id = types.timeuuid();
  const { name } = req.body;
  const balance = 0;
  const params = [id, name, balance];
  clients
    .execute(insert(), params, { prepare: true })
    .then(() => res.status(201).json({ id }))
    .catch((err) => res.status(500).json({ err }));
};

const getClient = (req, res) => {
  getClientById(req.params.id)
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
  updateClient(id, name, 'name')
    .then(() => {
      res.status(200).json({ msg: 'Client name changed!' });
    })
    .catch((err) => res.status(500).json({ err }));
};

const deleteClient = (req, res) => {
  const { id } = req.params;

  clients
    .execute(deleteById(), [id], { prepare: true })
    .then(() => {
      res.status(200).json({
        msg: 'Client saccessfuly deleted!'
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

module.exports = {
  getClientInfo,
  topupBalance,
  buyPackageHandler,
  getClients,
  addClient,
  editClient,
  getClient,
  deleteClient
};
