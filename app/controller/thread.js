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
  async newComment() {
    const { comment } = this.ctx.request.body;
    const user = this.ctx.middleUser;
  }
  async getThread() {
    // 按照时间排序
    const { objectId } = this.ctx.request.query;
    if (!objectId) {
      const threads = await this.ctx.model.Thread.find().limit(5).sort({ _id: -1 });
      this.ctx.body = { success: true, threads };
      return;
    }
    const threads = await this.ctx.model.Thread.find({ _id: { $lt: objectId } }).limit(5).sort({ _id: -1 });
    this.ctx.body = { success: true, threads };
    return;

  }
}

module.exports = ThreadController;
