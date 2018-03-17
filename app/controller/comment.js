'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {
  async getComment() {
    const { sourse, _id } = this.ctx.request.query;
    const { user } = this.ctx;
    // 如果 sourse 是 thread
    if (sourse === 'thread') {
      const comments = await this.ctx.model.Comment.find({ threadSourceId: _id });
      this.ctx.body = { success: true, comments };
      return;
    }
    // 如果 sourse 是 comment
    if (sourse === 'comment') {

    }
  }
  async praise() {
    const { _id } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }
    const updateRes = await this.ctx.model.Comment.update({ _id }, { $inc: { praises: 1 }, $push: { praiseInfo: { avatarUrl: user.avatarUrl, openid: user.openid } } });
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
    const updateRes = await this.ctx.model.Comment.update({ _id }, { $inc: { praises: -1 }, $pull: { praiseInfo: { avatarUrl: user.avatarUrl, openid: user.openid } } });
    if (updateRes.ok) {
      this.ctx.body = { success: true };
      return;
    }
    this.ctx.body = { success: false };
  }
}

module.exports = CommentController;
