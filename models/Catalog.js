const { axiosGet, axiosPost } = require('./utils');

const entity = {
  products: '/products',
  cost: '/products/cost',
  packages: '/packages',
  basePackages: '/packages/base'
};

const getProductsCost = options => axiosPost(entity.cost, options);
const createPackage = options => axiosPost(entity.packages, options);
const getPackagesBaseAll = () => axiosGet(entity.basePackages);

const getProductsAll = req => {
  const url = req.query.filter ? `${entity.products}?ids=${req.query.filter}` : entity.products;
  return axiosGet(url);
};

const getPackageInfo = id => {
  return axiosGet(`${entity.packages}/${id}/info`);
};

module.exports = {
  getProductsAll,
  getPackagesBaseAll,
  getProductsCost,
  createPackage,
  getPackageInfo
};
