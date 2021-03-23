const clients = require('../models/Clients');
const catalog = require('../models/Catalog');

const clientInfo = async (id) => {
  const result = {
    data: null,
    error: null
  };
  try {
    const resClient = await clients.getClientById(id);
    const client = await resClient.rows[0];
    console.log(client);
    console.log(client.package);
    const response = await catalog.getPackageInfo(client.package);
    console.log(response);
    const packageInfo = await response.data;
    client.package = packageInfo;
    result.data = client;
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
    errStatus: null
  };
  try {
    const resClient = await clients.getClientById(id);
    const resCost = await catalog.getProductsCost({ ids: productIds });
    const client = await resClient.rows[0];
    const dataCost = await resCost.data;
    const balance = client.balance - dataCost.cost;
    if (balance < 0) {
      result.errStatus = 402;
      throw new Error('Not enough balance, need top up');
    }
    const resPack = await catalog.createPackage({ ids: productIds });
    const dataPack = await resPack.data;
    result.packageId = dataPack.id;
    await clients.updateClient(client.id, balance, 'balance');
    await clients.updateClient(client.id, result.packageId, 'package');
    return result;
  } catch (err) {
    result.error = err;
    return result;
  };
};

module.exports = { clientInfo, buyPackage };
