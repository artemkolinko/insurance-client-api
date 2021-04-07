const axios = require('axios');

const baseUrl = process.env.CATALOG_URL;

const axiosGet = (entity, headers = {}) => axios.get(baseUrl + entity, headers);
const axiosPost = (entity, options = {}, headers = {}) => axios.post(baseUrl + entity, options, headers);

module.exports = { axiosGet, axiosPost };
