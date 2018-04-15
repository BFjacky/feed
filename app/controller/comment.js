'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');
class CommentController extends Controller {
  async getOneComment() {
    const { commentId } = this.ctx.request.body;
    const comment = await this.ctx.model.Comment.findOne({ _id: commentId });
    this.ctx.body = { success: true, comment };
    return;
  }
  // 获得一组评论的所有子评论，将子评论放在commentInfo属性下
  async getAllSubComments() {
    const recursionGet = async function(_this, _id, level) {
      level++;
      let results = [];
      const comment = await _this.ctx.model.Comment.findOne({ _id });
      results.push(comment);
      for (const sonComment of comment.commentInfo) {
        const comments = await recursionGet(_this, sonComment._id, level);
        results = results.concat(comments);
        // if (level === 1) {
        //   console.log(level + '级别递归效果', comments.length, '    results结果:', results.length);
        // }
      }
      // console.log('查询到了', results.length, level + '级别');
      return results;
    };
    const { comments } = this.ctx.request.body;
    for (const comment of comments) {
      const sonComments = await recursionGet(this, comment._id, 0);
      _.remove(sonComments, sonCommment => {
        return sonCommment._id == comment._id;
      });
      comment.commentInfo = sonComments;
    }
    this.ctx.body = { success: true, comments };
    return;
  }
  async getComment() {
    const { sourse, _id, commentId } = this.ctx.request.query;
    const { user } = this.ctx;
    // 如果 sourse 是 thread
    if (sourse === 'thread') {
      if (!commentId) {
        let comments = await this.ctx.model.Comment.find({ threadSourceId: _id }).limit(20).sort({ _id: -1 });
        comments = this.ctx.service.utils.checkPraised(comments, user._id);
        this.ctx.body = { success: true, comments };
        return;
      }
      let comments = await this.ctx.model.Comment.find({ threadSourceId: _id, _id: { $lt: commentId } }).limit(20).sort({ _id: -1 });
      comments = this.ctx.service.utils.checkPraised(comments, user._id);
      this.ctx.body = { success: true, comments };
      return;
    }
    // 如果 sourse 是 comment
    if (sourse === 'comment') {
      let comments = await this.ctx.model.Comment.find({ commentSourceId: _id }).sort({ _id: -1 });
      comments = this.ctx.service.utils.checkPraised(comments, user._id);
      this.ctx.body = { success: true, comments };
      return;
    }
  }
  async getHotComment() {
    const { sourse, _id } = this.ctx.request.query;
    const { user } = this.ctx;
    // 如果 sourse 是 thread
    if (sourse === 'thread') {
      let comments = await this.ctx.model.Comment.find({ threadSourceId: _id }).limit(3).sort({ praises: -1 });
      comments = this.ctx.service.utils.checkPraised(comments, user._id);
      this.ctx.body = { success: true, comments };
      return;
    }
  }
  async praise() {
    const { _id } = this.ctx.request.body;
    const { user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '请先登录' };
      return;
    }
    // 判断该comment中是否已经有了该用户的点赞
    const comment = await this.ctx.model.Comment.findOne({ _id });
    const flag = this.ctx.service.utils.checkOnePraised(comment, user._id);

    if (flag) {
      this.ctx.body = { success: false, message: '该用户已经为此条comment点过赞了' };
      return;
    }
    await this.ctx.model.Comment.update({ _id }, { $pull: { notReadPraiseInfo: { avatarUrl: user.avatarUrl, uid: user._id, nickName: user.nickName } } });
    await this.ctx.model.Comment.update({ _id }, { $push: { notReadPraiseInfo: { avatarUrl: user.avatarUrl, uid: user._id, nickName: user.nickName } } });
    const updateRes = await this.ctx.model.Comment.update({ _id }, { $inc: { praises: 1 }, $push: { praiseInfo: { avatarUrl: user.avatarUrl, uid: user._id, nickName: user.nickName } } });
    if (updateRes.ok) {
      this.ctx.body = { success: true };

      // 生成新点赞事件
      const Emitter = this.ctx.service.event.Emitter();
      Emitter.emit('praiseComment', _id, comment.uid);
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
    const comment = await this.ctx.model.Comment.findOne({ _id });
    const flag = this.ctx.service.utils.checkOnePraised(comment, user._id);

    if (!flag) {
      this.ctx.body = { success: false, message: '该用户没有未此条comment点过赞' };
      return;
    }
    const updateRes = await this.ctx.model.Comment.update({ _id }, { $inc: { praises: -1 }, $pull: { praiseInfo: { avatarUrl: user.avatarUrl, uid: user._id } } });
    if (updateRes.ok) {
      this.ctx.body = { success: true };

      // // 生成新点赞事件
      // const Emitter = this.ctx.service.event.Emitter();
      // Emitter.emit('praiseComment', _id, comment.uid);

      return;
    }
    this.ctx.body = { success: false };
  }
}

module.exports = CommentController;
