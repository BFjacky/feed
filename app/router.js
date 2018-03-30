'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  router.get('/oauth', controller.wxsdk.oauth);

  router.get('/sign', controller.wxsdk.sign);

  router.post('/file/transfer', controller.file.transfer);

  router.post('/thread/newThread', controller.thread.newThread);

  router.post('/thread/deleteThread', controller.thread.deleteThread);

  router.post('/thread/getOneThread', controller.thread.getOneThread);

  router.get('/thread/getThread', controller.thread.getThread);

  router.post('/thread/getFocusThread', controller.thread.getFocusThread);

  router.post('/thread/getHotThread', controller.thread.getHotThread);

  router.post('/thread/getThreadByType', controller.thread.getThreadByType);

  router.post('/thread/getThreadByUser', controller.thread.getThreadByUser);

  router.post('/thread/praise', controller.thread.praise);

  router.post('/thread/cancelPraise', controller.thread.cancelPraise);

  router.post('/thread/newComment', controller.thread.newComment);

  router.post('/comment/getOneComment', controller.comment.getOneComment);

  router.get('/comment/getComment', controller.comment.getComment);

  router.get('/comment/getHotComment', controller.comment.getHotComment);

  router.post('/comment/praise', controller.comment.praise);

  router.post('/comment/cancelPraise', controller.comment.cancelPraise);

  router.get('/user/get', controller.user.get);

  router.get('/user/getUesrById', controller.user.getUesrById);

  router.post('/user/focus', controller.user.focus);

  router.post('/user/cancelFocus', controller.user.cancelFocus);

  router.post('/user/shields', controller.user.shields);

  router.post('/user/cancelShields', controller.user.cancelShields);

  router.post('/user/getNotifyNoRead', controller.user.getNotifyNoRead);

  router.post('/user/readNotify', controller.user.readNotify);
};
