const axios = require('axios');

const getList = async () => {
  try {
    const testUrl = 'http://localhost:3001/api/v1/products';
    const res = await axios.get(testUrl);
    const data = await res.data;
    return data;
  } catch (err) {
    console.warn(err.message);
  }
};

module.exports = { getList };
