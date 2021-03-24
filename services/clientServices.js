const clients = require('../models/Clients');
const catalog = require('../models/Catalog');

const clientInfo = async (id) => {
  const result = {
    data: null,
    error: null,
  };
  try {
    const resClient = await clients.getClientById(id);
    const client = await resClient.rows[0];
    const response = await catalog.getPackageInfo(client.package);
    const packageInfo = await response.data;
    client.package = packageInfo;
    result.data = client;
    return result;
  } catch (err) {
    result.error = err;
    return result;
  }
};

const topupBalance = async (id, amount) => {
  const result = {
    balance: null,
    error: null,
  };
  try {
    const result = await clients.getClientById(id);
    const client = result.rows[0];
    let { balance } = client;
    balance = balance + amount;
    await clients.updateClient(client.id, balance, 'balance');
    result.balance = balance;
    return result;
  } catch (err) {
    result.error = err;
    return result;
  }
};

const buyPackage = async (id, productIds) => {
  const result = {
    packageId: null,
    error: null,
    errStatus: null,
  };
  try {
    const resClient = await clients.getClientById(id);
    const client = await resClient.rows[0];
    // const client = resClient.rows[0];

    const resCost = await catalog.getProductsCost(productIds);
    const dataCost = await +resCost.data;
    // const dataCost = +resCost.data;

    const balance = client.balance - dataCost;
    if (balance < 0) {
      result.errStatus = 402;
      throw new Error('Not enough balance, need top up');
    }

    // POST to Java API
    const resPack = await catalog.createPackage({
      description: 'some desc',
      name: 'Super Package',
      productIds,
    });

    const dataPack = await resPack.data;
    // const dataPack = resPack.data;

    result.packageId = dataPack.id;
    await clients.updateClient(client.id, balance, 'balance');
    await clients.updateClient(client.id, result.packageId, 'package');
    return result;
  } catch (err) {
    result.error = err;
    return result;
  }
};

module.exports = { clientInfo, topupBalance, buyPackage };
