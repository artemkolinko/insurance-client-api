const catalog = require('../models/Catalog');

const getProducts = async (req, res) => {
  const data = await catalog.getList();
  res.status(200).json(data);
};

const getPackages = (req, res) => {
  console.warn('getPackages');
  res.status(200).json({ msg: 'getPackages' });
};

const getPackageInfo = (req, res) => {
  const { id } = req.params;
  console.warn('getPackageInfo :', id);
  res.status(200).json({ id });
};

module.exports = { getProducts, getPackages, getPackageInfo };
