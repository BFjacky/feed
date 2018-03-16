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
}

module.exports = CommentController;
