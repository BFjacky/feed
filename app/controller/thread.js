'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');
class ThreadController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async newThread() {
    const { thread } = this.ctx.request.body;
    const { feedCookie, user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '未获得到user' };
      return;
    }
    if (!user._id) {
      this.ctx.body = { success: false, message: '未获得到_id' };
      return;
    }
    console.log(user);
    const threadData = new this.ctx.model.Thread({ uid: user._id, avatarUrl: user.avatarUrl, nickName: user.nickName, content: thread.content, imgs: thread.imgs, themeText: thread.themeText, praises: 0, comments: 0 });
    await threadData.save();
    this.ctx.body = { success: true };
  }
  async getThread() {
    // 按照时间排序
    const { user } = this.ctx;
    const { objectId } = this.ctx.request.query;
    if (!objectId) {
      let threads = await this.ctx.model.Thread.find().limit(5).sort({ _id: -1 });
      threads = this.ctx.service.utils.checkPraised(threads, user._id);
      this.ctx.body = { success: true, threads };
      return;
    }
    let threads = await this.ctx.model.Thread.find({ _id: { $lt: objectId } }).limit(5).sort({ _id: -1 });
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
    if (!objectIds) {
      const threads2 = await this.ctx.model.Thread.find().sort({ praises: -1, _id: -1 });
      for (const thread of threads2) {
        console.log(thread.praises);
      }
      let threads = await this.ctx.model.Thread.find().limit(5).sort({ praises: -1, _id: -1 });
      threads = this.ctx.service.utils.checkPraised(threads, user._id);
      this.ctx.body = { success: true, threads };
      return;
    }
    // 根据前端传递的objectIds判断是否重复
    const tempThreads = await this.ctx.model.Thread.find().sort({ praises: -1, _id: -1 });
    let threads = [];
    for (const thread of tempThreads) {
      if (!checkObjectId(objectIds, thread._id)) {
        threads.push(thread);
      }
      if (threads.length >= 5) {
        break;
      }
    }
    threads = this.ctx.service.utils.checkPraised(threads, user._id);
    this.ctx.body = { success: true, threads };
    return;
  }

  async getThreadByType() {
    console.log('here');
    // 按照时间排序
    const { user } = this.ctx;
    const { objectId, themeText } = this.ctx.request.body;
    if (!objectId) {
      let threads = await this.ctx.model.Thread.find({ themeText }).limit(5).sort({ _id: -1 });
      threads = this.ctx.service.utils.checkPraised(threads, user._id);
      this.ctx.body = { success: true, threads };
      return;
    }
    let threads = await this.ctx.model.Thread.find({ _id: { $lt: objectId }, themeText }).limit(5).sort({ _id: -1 });
    threads = this.ctx.service.utils.checkPraised(threads, user._id);
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
    const { _id, comment, sourse } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user || !user._id) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }

    // 判断此条comment 的对象是 thread 还是 comment
    if (sourse === 'thread') {
      const threadData = new this.ctx.model.Comment({ threadSourceId: _id, content: comment.content, avatarUrl: user.avatarUrl, nickName: user.nickName, uid: user._id, praises: 0, comments: 0 });
      await threadData.save();
      const updateRes = await this.ctx.model.Thread.update({ _id }, { $inc: { comments: 1 }, $push: { commentInfo: { avatarUrl: user.avatarUrl, uid: user._id, content: comment.content } } });
      if (updateRes.ok) {
        this.ctx.body = { success: true };
        return;
      }
      this.ctx.body = { success: false };
      return;
    }
    if (sourse === 'comment') {
      const threadData = new this.ctx.model.Comment({ commentSourceId: _id, content: comment.content, avatarUrl: user.avatarUrl, nickName: user.nickName, uid: user._id, praises: 0, comments: 0 });
      await threadData.save();
      const updateRes = await this.ctx.model.Comment.update({ _id }, { $inc: { comments: 1 } });
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
