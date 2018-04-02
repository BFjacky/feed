'use strict';

// had enabled by egg
// exports.static = true;

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.qiniu2 = {
  enable: true,
  package: 'egg-qiniu2',
};


exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
