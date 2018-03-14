'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.wxsdk.oauth);

  router.get('/sign', controller.wxsdk.sign);

  router.post('/file/transfer', controller.file.transfer);

  router.post('/thread/newThread', controller.thread.newThread);


  router.post('/thread/getThread', controller.thread.getThread);

  router.post('/thread/newComment', controller.thread.newComment);

  router.post('/user/sync', controller.user.sync);
};
