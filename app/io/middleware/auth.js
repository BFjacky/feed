'use strict';
module.exports = app => {
  return async (ctx, next) => {
    console.log('连接上了');
    await next();
  };
};
