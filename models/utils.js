const axios = require('axios');

const baseUrl = process.env.CATALOG_URL;

const axiosGet = (entity, token) => axios.get(baseUrl + entity, { headers: { Authorization: `Bearer ${token}` } });
const axiosPost = (entity, options = {}, token) => {
  return axios.post(baseUrl + entity, options, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

module.exports = { axiosGet, axiosPost };
