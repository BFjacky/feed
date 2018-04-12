'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');
class ThreadController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async newThread() {
    const { thread } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '未获得到user' };
      return;
    }
    if (!user._id) {
      this.ctx.body = { success: false, message: '未获得到_id' };
      return;
    }
    if (!user.pass) {
      this.ctx.body = { success: false, message: '未通过答题测试' };
      return;
    }
    const threadData = new this.ctx.model.Thread({ uid: user._id, avatarUrl: user.avatarUrl, nickName: user.nickName, content: thread.content, imgs: thread.imgs, video: thread.video, themeText: thread.themeText, praises: 0, comments: 0 });
    const data = await threadData.save();

    // 触发新动态事件
    const Emitter = this.ctx.service.event.Emitter();
    Emitter.emit('newThread', data);

    this.ctx.body = { success: true };
  }
  async deleteThread() {
    const { thread } = this.ctx.request.body;
    const { user } = this.ctx;
    if (thread.uid != user._id) {
      this.ctx.body = { success: false };
      return;
    }
    if (!user) {
      this.ctx.body = { success: false, message: '未获得到user' };
      return;
    }
    if (!user._id) {
      this.ctx.body = { success: false, message: '未获得到_id' };
      return;
    }
    const updateRes = await this.ctx.model.Thread.update({ _id: thread._id }, { isDelete: true });
    console.log(updateRes);
    this.ctx.body = { success: true };
  }
  async getOneThread() {
    const { threadId } = this.ctx.request.body;
    const thread = await this.ctx.model.Thread.findOne({ _id: threadId, isDelete: false || undefined });
    this.ctx.body = { success: true, thread };
    return;
  }
  // 获得一个comment 所属的源头thread
  async getSourceThread() {
    try {
      const { commentId } = this.ctx.request.body;
      let nowComment = await this.ctx.model.Comment.findOne({ _id: commentId });
      while (nowComment.commentSourceId) {
        nowComment = await this.ctx.model.Comment.findOne({ _id: nowComment.commentSourceId });
      }
      const thread = await this.ctx.model.Thread.findOne({ _id: nowComment.threadSourceId });
      this.ctx.body = { success: true, thread };
    } catch (error) {
      this.ctx.body = { success: false, error };
    }
  }
  async getThread() {
    // 按照时间排序
    const { user } = this.ctx;
    const { objectId } = this.ctx.request.query;
    const shieldIds = [];
    if (user.shields) {
      for (const ele of user.shields) {
        shieldIds.push(ele.uid);
      }
    }
    if (!objectId) {
      let threads = await this.ctx.model.Thread.find({ isDelete: false || undefined, uid: { $nin: shieldIds } }).limit(15).sort({ _id: -1 });
      threads = this.ctx.service.utils.checkPraised(threads, user._id);
      this.ctx.body = { success: true, threads };
      return;
    }
    let threads = await this.ctx.model.Thread.find({ _id: { $lt: objectId }, isDelete: false || undefined, uid: { $nin: shieldIds } }).limit(15).sort({ _id: -1 });
    threads = this.ctx.service.utils.checkPraised(threads, user._id);
    this.ctx.body = { success: true, threads };
    return;

  }

  async getFocusThread() {
    // 按照时间排序
    const { user } = this.ctx;
    const { objectId } = this.ctx.request.body;
    const focusIds = [];
    if (user.focus) {
      for (const ele of user.focus) {
        focusIds.push(ele.uid);
      }
    }
    if (!objectId) {
      let threads = await this.ctx.model.Thread.find({ isDelete: false || undefined, uid: { $in: focusIds } }).limit(15).sort({ _id: -1 });
      threads = this.ctx.service.utils.checkPraised(threads, user._id);
      this.ctx.body = { success: true, threads };
      return;
    }
    let threads = await this.ctx.model.Thread.find({ _id: { $lt: objectId }, uid: { $in: focusIds }, isDelete: false || undefined }).limit(15).sort({ _id: -1 });
    threads = this.ctx.service.utils.checkPraised(threads, user._id);
    this.ctx.body = { success: true, threads };
    return;
  }
  async getHotThread() {
    // 判断objectId 是否存在与 objectids中
    function checkObjectId(objectIds, objectId) {
      for (const id of objectIds) {
        if (id == objectId) {
          return true;
        }
      }
      return false;
    }
    // 按照热度排序
    const { objectIds } = this.ctx.request.body;
    const { user } = this.ctx;
    const shieldIds = [];
    if (user.shields) {
      for (const ele of user.shields) {
        shieldIds.push(ele.uid);
      }
    }
    if (!objectIds) {
      const threads2 = await this.ctx.model.Thread.find({ isDelete: false || undefined, uid: { $nin: shieldIds } }).sort({ praises: -1, _id: -1 });
      for (const thread of threads2) {
        // console.log(thread.praises);
      }
      let threads = await this.ctx.model.Thread.find({ isDelete: false || undefined, uid: { $nin: shieldIds } }).limit(15).sort({ praises: -1, _id: -1 });
      threads = this.ctx.service.utils.checkPraised(threads, user._id);
      this.ctx.body = { success: true, threads };
      return;
    }
    // 根据前端传递的objectIds判断是否重复
    const tempThreads = await this.ctx.model.Thread.find({ isDelete: false || undefined, uid: { $nin: shieldIds } }).sort({ praises: -1, _id: -1 });
    let threads = [];
    for (const thread of tempThreads) {
      if (!checkObjectId(objectIds, thread._id)) {
        threads.push(thread);
      }
      if (threads.length >= 15) {
        break;
      }
    }
    threads = this.ctx.service.utils.checkPraised(threads, user._id);
    this.ctx.body = { success: true, threads };
    return;
  }

  async getThreadByType() {
    // 按照时间排序
    const { user } = this.ctx;
    const { objectId, themeText } = this.ctx.request.body;
    const shieldIds = [];
    if (user.shields) {
      for (const ele of user.shields) {
        shieldIds.push(ele.uid);
      }
    }
    if (!objectId) {
      let threads = await this.ctx.model.Thread.find({ isDelete: false || undefined, themeText, uid: { $nin: shieldIds } }).limit(15).sort({ _id: -1 });
      threads = this.ctx.service.utils.checkPraised(threads, user._id);
      this.ctx.body = { success: true, threads };
      return;
    }
    let threads = await this.ctx.model.Thread.find({ _id: { $lt: objectId }, themeText, isDelete: false || undefined, uid: { $nin: shieldIds } }).limit(15).sort({ _id: -1 });
    threads = this.ctx.service.utils.checkPraised(threads, user._id);
    this.ctx.body = { success: true, threads };
    return;
  }

  async getThreadByUser() {
    // 获得某一个用户的thread
    const { user } = this.ctx;
    const { objectId, uid } = this.ctx.request.body;
    // 如果没传uid这个参数则，默认为查询本user的threads,否则查询传过来的uid的thread
    if (!objectId) {
      let threads = await this.ctx.model.Thread.find({ uid: uid ? uid : user._id, isDelete: false || undefined }).limit(15).sort({ _id: -1 });
      threads = this.ctx.service.utils.checkPraised(threads, uid ? uid : user._id);
      this.ctx.body = { success: true, threads };
      return;
    }
    let threads = await this.ctx.model.Thread.find({ _id: { $lt: objectId }, uid: uid ? uid : user._id, isDelete: false || undefined }).limit(15).sort({ _id: -1 });
    threads = this.ctx.service.utils.checkPraised(threads, uid ? uid : user._id);
    this.ctx.body = { success: true, threads };
    return;
  }

  async praise() {
    const { _id } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }

    // 判断该thread中是否已经有了该用户的点赞
    const thread = await this.ctx.model.Thread.findOne({ _id });
    const flag = this.ctx.service.utils.checkOnePraised(thread, user._id);
    if (flag) {
      this.ctx.body = { success: false, message: '该用户已经为此条thread点过赞了' };
      return;
    }
    // 删除此用户的点赞信息
    const updateRes = await this.ctx.model.Thread.update({ _id }, { $inc: { praises: 1 }, $push: { praiseInfo: { avatarUrl: user.avatarUrl, uid: user._id } } });
    if (updateRes.ok) {
      this.ctx.body = { success: true };
      return;
    }
    this.ctx.body = { success: false };
  }

  async cancelPraise() {
    const { _id } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }
    // 判断该thread中是否已经有了该用户的点赞
    const thread = await this.ctx.model.Thread.findOne({ _id });
    const flag = this.ctx.service.utils.checkOnePraised(thread, user._id);
    if (!flag) {
      this.ctx.body = { success: false, message: '该用户没有为此条thread点过赞' };
      return;
    }
    const updateRes = await this.ctx.model.Thread.update({ _id }, { $inc: { praises: -1 }, $pull: { praiseInfo: { avatarUrl: user.avatarUrl, uid: user._id } } });
    if (updateRes.ok) {
      this.ctx.body = { success: true };
      return;
    }
    this.ctx.body = { success: false };
  }

  async newComment() {
    const Emitter = this.ctx.service.event.Emitter();
    const { _id, comment, sourse } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user || !user._id) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }
    // 判断此条comment 的对象是 thread 还是 comment
    if (sourse === 'thread') {
      const commentData = new this.ctx.model.Comment({ threadSourceId: _id, content: comment.content, imgs: comment.imgs, avatarUrl: user.avatarUrl, nickName: user.nickName, uid: user._id, praises: 0, comments: 0 });
      const newComment = await commentData.save();
      const updateRes = await this.ctx.model.Thread.update({ _id }, { $inc: { comments: 1 }, $push: { commentInfo: { _id: newComment._id, avatarUrl: user.avatarUrl, uid: user._id, content: comment.content, nickName: user.nickName } } });

      // 生成一条通知
      const sourceThread = await this.ctx.model.Thread.findOne({ _id });
      const sourceUid = sourceThread.uid;
      const sourceContent = sourceThread.content;
      const notifyData = new this.ctx.model.Notify({ uid: sourceUid, hasRead: false, threadSourceId: _id, sourceContent, imgs: comment.imgs, commentInfo: { avatarUrl: user.avatarUrl, uid: user._id, content: comment.content, nickName: user.nickName }, commentId: newComment._id });
      await notifyData.save();
      // 生成新通知事件
      Emitter.emit('newNotify', sourceUid);

      if (updateRes.ok) {
        this.ctx.body = { success: true };
        return;
      }
      this.ctx.body = { success: false };
      return;
    }
    if (sourse === 'comment') {
      const commentData = new this.ctx.model.Comment({ commentSourceId: _id, content: comment.content, imgs: comment.imgs, avatarUrl: user.avatarUrl, nickName: user.nickName, uid: user._id, praises: 0, comments: 0 });
      const newComment = await commentData.save();
      const updateRes = await this.ctx.model.Comment.update({ _id }, { $inc: { comments: 1 }, $push: { commentInfo: { _id: newComment._id, avatarUrl: user.avatarUrl, uid: user._id, content: comment.content, nickName: user.nickName } } });

      // 生成一条通知
      const sourceComment = await this.ctx.model.Comment.findOne({ _id });
      const sourceUid = sourceComment.uid;
      const sourceContent = sourceComment.content;
      const notifyData = new this.ctx.model.Notify({ uid: sourceUid, hasRead: false, commentSourceId: _id, sourceContent, imgs: comment.imgs, commentInfo: { avatarUrl: user.avatarUrl, uid: user._id, content: comment.content }, commentId: newComment._id });
      await notifyData.save();
      // 生成新通知事件
      Emitter.emit('newNotify', sourceUid);

      if (updateRes.ok) {
        this.ctx.body = { success: true };
        return;
      }
      this.ctx.body = { success: false };
      return;
    }
  }
}

module.exports = ThreadController;
