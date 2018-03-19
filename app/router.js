'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/oauth', controller.wxsdk.oauth);

  router.get('/sign', controller.wxsdk.sign);

  router.post('/file/transfer', controller.file.transfer);

  router.post('/thread/newThread', controller.thread.newThread);

  router.get('/thread/getThread', controller.thread.getThread);

  router.post('/thread/getHotThread', controller.thread.getHotThread);

  router.post('/thread/getThreadByType', controller.thread.getThreadByType);

  router.post('/thread/praise', controller.thread.praise);

  router.post('/thread/cancelPraise', controller.thread.cancelPraise);

  router.post('/thread/newComment', controller.thread.newComment);

  router.get('/comment/getComment', controller.comment.getComment);

  router.get('/comment/getHotComment', controller.comment.getHotComment);

  router.post('/comment/praise', controller.comment.praise);

  router.post('/comment/cancelPraise', controller.comment.cancelPraise);

  router.get('/user/get', controller.user.get);
};
