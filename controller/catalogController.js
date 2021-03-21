const axios = require('axios');

const baseUrl = process.env.CATALOG_URL;
const entity = {
  products: '/products',
  cost: '/products/cost',
  packages: '/packages',
  basePackages: '/packages/base'
};

const axiosGet = entity => axios.get(baseUrl + entity);
const axiosPost = (entity, options = {}) => axios.post(baseUrl + entity, options);

const getProductsCost = options => axiosPost(entity.cost, options);
const createPackage = options => axiosPost(entity.packages, options);

const getProducts = async (req, res) => {
  const url = req.query.ids ? `${entity.products}?ids=${req.query.ids}` : entity.products;
  try {
    const response = await axiosGet(url);
    const data = await response.data;
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getPackages = async (req, res) => {
  try {
    const response = await axiosGet(entity.basePackages);
    const data = await response.data;
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getPackageInfo = async (req, res) => {
  try {
    const {id} = req.params;
    console.warn('getPackageInfo :', id);
    const response = await axiosGet(`${entity.packages}/${id}/info`);
    const data = await response.data;
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { getProducts, getProductsCost, createPackage, getPackages, getPackageInfo };
