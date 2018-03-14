'use strict';
// app/middleware/userHandler.js
const axios = require('axios');

module.exports = () => async function(ctx, next) {
  console.log('进入中间件');
  await next();
};
