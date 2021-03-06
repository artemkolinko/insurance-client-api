const clients = require('../models/Clients');
const catalog = require('../models/Catalog');
const { testId } = require('../auxiliary');

const clientInfo = async (id, token) => {
  const result = {
    data: null,
    error: null
  };
  try {
    const resClient = await clients.getClientById(id);
    const client = resClient.rows[0];

    if (!client) {
      result.error = new Error('Client does not exist');
      return result;
    }

    if (!client.package) {
      result.data = client;
      return result;
    }
    const response = await catalog.getPackageInfo(client.package, token);
    const packageInfo = await response.data;
    client.package = packageInfo;
    result.data = client;
    return result;
  } catch (err) {
    result.error = err;
    return result;
  }
};

const topupBalance = async (id, amount, res, next) => {
  try {
    const result = await clients.getClientById(id);
    const client = result.rows[0];
    if (!client) {
      res.status(404);
      throw new Error('Client not found');
    }
    let { balance } = client;
    balance = balance + amount;
    await clients.updateClient(client.id, balance, 'balance');
    res.send({ balance });
  } catch (err) {
    next(err);
  }
};

const buyPackage = async (id, body, token) => {
  const result = {
    packageId: null,
    error: null,
    errStatus: 400
  };

  try {
    if (!testId(id)) {
      throw new Error(`id: [${id}] is invalid`);
    }
    if (!body.name ||
        !body.description ||
        !body.productIds) {
      throw new Error('Parametrs are missing');
    }
    const { name, description, productIds } = body;
    if (name.trim() === '' || description === '') {
      throw new Error('Package name or description is empty');
    }
    productIds.forEach((productId) => {
      if (!testId(productId)) {
        throw new Error(`id: [${productId}] is invalid`);
      }
    });
    const resClient = await clients.getClientById(id);
    const client = resClient.rows[0];

    const resCost = await catalog.getProductsCost(productIds, token);
    const dataCost = +resCost.data;

    const balance = client.balance - dataCost;
    if (balance < 0) {
      result.errStatus = 402;
      throw new Error('Not enough balance, need top up');
    }

    // POST to Java API
    const resPack = await catalog.createPackage(
      {
        description,
        name,
        productIds
      },
      token
    );

    const dataPack = resPack.data;
    result.packageId = dataPack.id;
    await clients.updateClient(client.id, balance, 'balance');
    await clients.updateClient(client.id, result.packageId, 'package');
    return result;
  } catch (err) {
    result.error = err;
    return result;
  }
};

module.exports = {
  clientInfo,
  topupBalance,
  buyPackage
};
