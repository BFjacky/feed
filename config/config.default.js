'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1519273404542_1221';

  // add your config here
  config.middleware = [];

  config.mongoose = {
    url: 'mongodb://127.0.0.1/xn_feed',
    options: {},
  };

  config.qiniu2 = {
    client: {
      ak: 'rVFSjXPW6BUAcPrHAjwDJBT5kfm7T-hIgTlHSj82',
      sk: 'ux9tk7GcTWlrtZJjYOmAgcbK6M_ysCXIoeYTo3jL',
      bucket: 'xn-feed-dev',
    },
  };

  return config;
};
