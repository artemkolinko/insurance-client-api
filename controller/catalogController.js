const catalog = require('../models/Catalog');

const getProducts = async (req, res) => {
  try {
    const response = await catalog.getProductsAll(req);
    const data = await response.data;
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getPackagesBase = async (_, res) => {
  try {
    const response = await catalog.getPackagesBaseAll();
    const data = await response.data;
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getProducts,
  getPackagesBase
};
