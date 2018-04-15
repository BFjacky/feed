'use strict';
const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1519273404542_1221';

  config.mongoose = {
    url: 'mongodb://127.0.0.1/xn_feed',
    options: {},
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  config.qiniu2 = {
    domain: 'http://static.xiaonei.io',
    urlKey1: '7b990a8b439a169bde9bc2885498fb894688d0ab',
    urlKey2: '39bb21b95fabaabb948bf28bdc982b996fbb6aa8',
    client: {
      ak: 'rVFSjXPW6BUAcPrHAjwDJBT5kfm7T-hIgTlHSj82',
      sk: 'ux9tk7GcTWlrtZJjYOmAgcbK6M_ysCXIoeYTo3jL',
      bucket: 'xiaonei',
    },
  };

  // middleware
  config.middleware = [ 'cookie' ];

  // ignore csrf
  config.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
    xframe: {
      enable: false,
    },
    methodnoallow: {
      enable: false,
    },
    domainWhiteList: [ 'http://myccc.feit.me', 'http://localhost:8081' ],
  };
  config.cors = {
    credentials: true,
  };

  // socket.io
  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [],
      },
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
    security: {
      csrf: {
        ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      },
      xframe: {
        enable: false,
      },
      methodnoallow: {
        enable: false,
      },
      domainWhiteList: [ 'http://myccc.feit.me', 'http://localhost:8080' ],
    },
  };

  // add static file server
  config.static = {
    prefix: '/',
    dir: path.join(appInfo.baseDir, 'app/public'),
    dynamic: true,
  };

  // urls
  config.url = {
    token_account: 'https://account.xiaonei.io/user/get?aid=',
    token_jwcxn: 'https://jwc.xiaonei.io/student/get?aid=',
  };
  return config;
};
