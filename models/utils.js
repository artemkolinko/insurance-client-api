const axios = require('axios');

const baseUrl = process.env.CATALOG_URL;

const axiosGet = entity => axios.get(baseUrl + entity);
const axiosPost = (entity, options = {}) => axios.post(baseUrl + entity, options);

module.exports = { axiosGet, axiosPost };
