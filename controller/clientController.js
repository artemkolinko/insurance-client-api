const { types } = require('cassandra-driver');
const clients = require('../models/Clients');
const services = require('../services/clientServices');

const topupBalanceHandler = async (req, res) => {
  const amount = parseInt(req.body.amount);
  const { id } = req.params;

  let errStatus = 500;
  try {
    if (Number.isNaN(amount) || amount < 0) {
      errStatus = 400;
      throw new Error('amount is negative or undefined');
    }
    const result = await services.topupBalance(id, amount);
    if (result.error) {
      throw new Error(result.error.message);
    }
    res.send({ balance: result.balance });
  } catch (err) {
    res.status(errStatus).send({ error: err.message });
  }
};

const buyPackageHandler = async (req, res) => {
  let errStatus = 400;
  try {
    if (!req.body.ids) {
      throw new Error('Parametr "ids" is null or not exist');
    } else if (req.body.ids) {
      const ids = req.body.ids;
      ids.forEach((id) => {
        if (!id.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g)) {
          throw new Error(`id [${id}] is in wrong format.`);
        }
      });
    }
    // buyPackage() - async func, return object
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
  try {
    if (!req.params.id) {
      errStatus = 400;
      throw new Error('Path parametr {id} incorrect or not exists');
    }

    const { id } = req.params;
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
    clients.cli
      .execute(clients.selectByName(name))
      .then((result) => res.status(200).send(result.rows))
      .catch((err) => res.status(500).json({ err }));
  } else {
    clients.cli
      .execute(clients.selectAll())
      .then((result) => res.status(200).send(result.rows))
      .catch((err) => res.status(500).json({ err }));
  }
};

const addClient = (req, res) => {
  const id = types.timeuuid();
  const { name } = req.body;
  try {
    if (!name) { throw new Error('Parametr "name" is null or not exist'); }
    if (name.match(/^\d+$/g)) { throw new Error('Parametr "name" should be "string"'); }
    const balance = 0;
    const params = [id, name, balance];
    clients.cli
      .execute(clients.insert(), params, { prepare: true })
      .then(() => res.status(201).json({ id }))
      .catch((err) => res.status(500).json({ err }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getClient = (req, res) => {
  try {
    if (!req.params.id.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g)) {
      throw new Error('Client id is in wrong format.');
    }
    clients
      .getClientById(req.params.id)
      .then((result) => {
        res.status(200).json(result.rows[0]);
      })
      .catch((err) => {
        res.status(404).json({ err });
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const editClient = (req, res) => {
  const { id } = req.params;
  // get client new name
  const { name } = req.body;
  try {
    if (!name) { throw new Error('Parametr "name" is null or not exist'); }
    if (!id.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g)) {
      throw new Error('Client id is in wrong format.');
    }
    clients
      .updateClient(id, name, 'name')
      .then(() => {
        res.status(200).json({ msg: 'Client name changed!' });
      })
      .catch((err) => res.status(500).json({ err }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteClient = (req, res) => {
  const { id } = req.params;

  try {
    if (!id.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g)) {
      throw new Error('Client id is in wrong format.');
    }
    clients.cli
      .execute(clients.deleteById(), [id], { prepare: true })
      .then(() => {
        res.status(200).json({
          msg: 'Client saccessfuly deleted!'
        });
      })
      .catch((err) => res.status(500).json({ err }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getClientInfo,
  topupBalanceHandler,
  buyPackageHandler,
  getClients,
  addClient,
  editClient,
  getClient,
  deleteClient
};
