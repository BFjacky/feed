'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/file/transfer', controller.file.transfer);

  router.post('/thread/newThread', controller.thread.newThread);
};
