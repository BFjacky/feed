'use strict';
module.exports = app => {
  return async (ctx, next) => {
    console.log('有一个连接');
    await next();
  };
};
