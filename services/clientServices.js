const clients = require('../models/Clients');
const catalog = require('../models/Catalog');
const { testId } = require('../auxiliary');

// const createClient = async (req, res) => {
//   const errStatus = 400;
//   if (!req.body.name) {
//     return res.status(errStatus).json({ error: 'name required' });
//   }
//   const { name, amount } = req.body;
//   if (name.match(/^\d+$/g)) {
//     return res.status(errStatus).send({ error: 'name should be "string"' });
//   }

//   const params = [req.user.sub, name, amount];
//   return clients.cli.execute(clients.insert(), params, { prepare: true });
// };

const clientInfo = async (id) => {
  const result = {
    data: null,
    error: null
  };
  try {
    const resClient = await clients.getClientById(id);
    const client = await resClient.rows[0];
    if (!client.package) {
      result.data = client;
      return result;
    }
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

// const topupBalance = async (client, amount, res) => {
//   try {
//     let { balance } = client;
//     if (!balance) {
//       balance = amount;
//     } else { balance = balance + amount; }

//     await clients.updateClient(client.id, balance, 'balance');

//     const resClient = await clients.getClientById(client.id);
//     const balanceCheck = resClient.rows[0].balance;

//     if (balanceCheck !== balance) {
//       throw new Error('balance topup rejected');
//     }

//     res.send({ balance: balanceCheck });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// };

const topupBalance = async (id, amount) => {
  const result = {
    balance: null,
    error: null
  };
  try {
    const result = await clients.getClientById(id);
    const client = result.rows[0];
    if (!client) {
      // How to return 404?
      result.error = new Error('Client not found');
      return result;
    }
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

const buyPackage = async (id, body) => {
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

    const resCost = await catalog.getProductsCost(productIds);
    const dataCost = +resCost.data;

    const balance = client.balance - dataCost;
    if (balance < 0) {
      result.errStatus = 402;
      throw new Error('Not enough balance, need top up');
    }

    // POST to Java API
    const resPack = await catalog.createPackage({
      description,
      name,
      productIds
    });

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
  // createClient,
  clientInfo,
  topupBalance,
  buyPackage
};
