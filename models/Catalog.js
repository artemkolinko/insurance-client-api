const { axiosGet, axiosPost } = require('./utils');

const entity = {
  products: '/products',
  cost: '/products/cost',
  packages: '/packages',
  basePackages: '/packages/base',
};

// const getProductsCost = options => axiosPost(entity.cost, options);
const getProductsCost = (array, token) => {
  let queryStr = '?';

  array.forEach((element) => {
    queryStr += 'ids=' + element + '&';
  });
  return axiosGet(entity.cost + queryStr, token);
};

const createPackage = (options, token) => axiosPost(entity.packages, options, token);
const getPackagesBaseAll = () => axiosGet(entity.basePackages);

const getProductsAll = (req) => {
  const url = req.query.filter
    ? `${entity.products}?ids=${req.query.filter}`
    : entity.products;
  return axiosGet(url);
};

const getPackageInfo = (id, token) => {
  return axiosGet(`${entity.packages}/${id}/info`, token);
};

module.exports = {
  getProductsAll,
  getPackagesBaseAll,
  getProductsCost,
  createPackage,
  getPackageInfo,
};
