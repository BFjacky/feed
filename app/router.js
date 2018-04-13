'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  app.io.of('/').route('init', app.io.controller.user.init);
  app.io.route('adminLogin', app.io.controller.user.adminLogin);
  app.io.route('operateThread', app.io.controller.user.operateThread);


  router.get('/', controller.home.index);
  router.get('/admin', controller.home.admin);

  router.get('/oauth', controller.wxsdk.oauth);

  router.get('/sign', controller.wxsdk.sign);

  router.post('/file/transfer', controller.file.transfer);

  router.post('/thread/newThread', controller.thread.newThread);

  router.post('/thread/deleteThread', controller.thread.deleteThread);

  router.post('/thread/getOneThread', controller.thread.getOneThread);

  router.post('/thread/getSourceThread', controller.thread.getSourceThread);

  router.get('/thread/getThread', controller.thread.getThread);

  router.post('/thread/getFocusThread', controller.thread.getFocusThread);

  router.post('/thread/getHotThread', controller.thread.getHotThread);

  router.post('/thread/getThreadByType', controller.thread.getThreadByType);

  router.post('/thread/getThreadByUser', controller.thread.getThreadByUser);

  router.post('/thread/praise', controller.thread.praise);

  router.post('/thread/cancelPraise', controller.thread.cancelPraise);

  router.post('/thread/newComment', controller.thread.newComment);

  router.post('/comment/getOneComment', controller.comment.getOneComment);

  router.post('/comment/getAllSubComments', controller.comment.getAllSubComments);

  router.get('/comment/getComment', controller.comment.getComment);

  router.get('/comment/getHotComment', controller.comment.getHotComment);

  router.post('/comment/praise', controller.comment.praise);

  router.post('/comment/cancelPraise', controller.comment.cancelPraise);

  router.get('/user/get', controller.user.get);

  router.get('/user/userpass', controller.user.userpass);

  router.get('/user/getShieldUesrById', controller.user.getShieldUesrById);

  router.get('/user/getFocusUesrById', controller.user.getFocusUesrById);

  router.get('/user/getFollowersUesrById', controller.user.getFollowersUesrById);

  router.get('/user/getOldNotifies', controller.user.getOldNotifies);

  router.post('/user/focus', controller.user.focus);

  router.post('/user/cancelFocus', controller.user.cancelFocus);

  router.post('/user/shields', controller.user.shields);

  router.post('/user/cancelShields', controller.user.cancelShields);

  router.post('/user/readNotify', controller.user.readNotify);
};
