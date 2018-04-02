'use strict';
module.exports = app => {
  return async (ctx, next) => {
    ctx.socket.emit('res', 'connected!lalalalala');
    await next();
    // execute when disconnect.
    console.log('disconnection!');
  };
};
