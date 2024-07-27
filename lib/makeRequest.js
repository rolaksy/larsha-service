const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN || "";

const makeRequest = (url, options = {}) => {
  const { method = 'GET', headers = {}, body } = options;

  // Replace SECRET_TOKEN with actual token
  if (headers.Authorization) {
    headers.Authorization = headers.Authorization.replace('SECRET_TOKEN', token);
  }

  return axios({
    url,
    method,
    headers,
    data: body
  })
  .then(response => ({
    ok: true,
    status: response.status,
    json: () => Promise.resolve(response.data),
    text: () => Promise.resolve(response.data),
  }))
  .catch(error => ({
    ok: false,
    status: error.response ? error.response.status : 500,
    json: () => Promise.reject(error),
    text: () => Promise.reject(error),
  }));
};

module.exports = makeRequest;
