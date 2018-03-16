'use strict';

const Controller = require('egg').Controller;
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
    if (!user.openid) {
      this.ctx.body = { success: false, message: '未获得到openid' };
      return;
    }
    console.log(user);
    const threadData = new this.ctx.model.Thread({ openid: user.openid, avatarUrl: user.avatarUrl, nickName: user.nickName, content: thread.content, imgs: thread.imgs, themeText: thread.themeText, praises: 0, comments: 0 });
    await threadData.save();
    this.ctx.body = { success: true };
  }
  async getThread() {
    // 按照时间排序
    const { user } = this.ctx;
    const { objectId } = this.ctx.request.query;
    if (!objectId) {
      const threads = await this.ctx.model.Thread.find().limit(5).sort({ _id: -1 });
      this.ctx.body = { success: true, threads, user };
      return;
    }
    const threads = await this.ctx.model.Thread.find({ _id: { $lt: objectId } }).limit(5).sort({ _id: -1 });
    this.ctx.body = { success: true, threads, user };
    return;

  }
  async praise() {
    const { _id } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }
    const updateRes = await this.ctx.model.Thread.update({ _id }, { $inc: { praises: 1 }, $push: { praiseInfo: { avatarUrl: user.avatarUrl, openid: user.openid } } });
    if (updateRes.ok) {
      this.ctx.body = { success: true }
      return;
    }
    this.ctx.body = { success: false }
  }

  async cancelPraise() {
    const { _id } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }
    const updateRes = await this.ctx.model.Thread.update({ _id }, { $inc: { praises: -1 }, $pull: { praiseInfo: { avatarUrl: user.avatarUrl, openid: user.openid } } });
    if (updateRes.ok) {
      this.ctx.body = { success: true }
      return;
    }
    this.ctx.body = { success: false }
  }

  async newComment() {
    const { _id, comment, sourse } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }

    //判断此条comment 的对象是 thread 还是 comment
    if (sourse === 'thread') {
      const threadData = new this.ctx.model.Comment({ threadSourceId: _id, content: comment.content, avatarUrl: user.avatarUrl, nickName: user.nickName, openid: user.openid });
      await threadData.save();
      const updateRes = await this.ctx.model.Thread.update({ _id }, { $inc: { comments: 1 }, $push: { commentInfo: { avatarUrl: user.avatarUrl, openid: user.openid, content: comment.content } } });
      if (updateRes.ok) {
        this.ctx.body = { success: true }
        return;
      }
      this.ctx.body = { success: false }
      return;
    }
    if (sourse === 'comment') {
      const threadData = new this.ctx.model.Comment({ commentSourceId: _id, content: comment.content, avatarUrl: user.avatarUrl, nickName: user.nickName, openid: user.openid });
      await threadData.save();
      const updateRes = await this.ctx.model.Comment.update({ _id }, { $inc: { comments: 1 } });
      if (updateRes.ok) {
        this.ctx.body = { success: true }
        return;
      }
      this.ctx.body = { success: false }
      return;
    }
  }
}

module.exports = ThreadController;
