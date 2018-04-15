

'use strict';

const Controller = require('egg').Controller;

const _ = require('lodash');
class UserController extends Controller {
  async get() {
    // 获得当前用户信息
    const { user } = this.ctx;
    user.openid = '';
    this.ctx.body = user;
  }
  async userpass() {
    const { user } = this.ctx;
    await this.ctx.model.User.update({ _id: user._id }, { pass: true });
    this.ctx.body = { success: true };
  }
  async getShieldUesrById() {
    const { user } = this.ctx;
    const users = [];
    const fields = [ 'avatarUrl', 'gender', 'nickName', 'city', 'province', 'country' ];
    for (const shield of user.shields) {
      const userRes = await this.ctx.model.User.findOne({ _id: shield.uid }, fields);
      users.push(userRes);
    }
    this.ctx.body = { success: true, users };
  }
  async getFocusUesrById() {
    const { user } = this.ctx;
    const users = [];
    const fields = [ 'avatarUrl', 'gender', 'nickName', 'city', 'province', 'country' ];
    for (const focus of user.focus) {
      const userRes = await this.ctx.model.User.findOne({ _id: focus.uid }, fields);
      users.push(userRes);
    }
    this.ctx.body = { success: true, users };
  }
  async getFollowersUesrById() {
    const { user } = this.ctx;
    const users = [];
    const fields = [ 'avatarUrl', 'gender', 'nickName', 'city', 'province', 'country' ];
    for (const followers of user.followers) {
      const userRes = await this.ctx.model.User.findOne({ _id: followers.uid }, fields);
      users.push(userRes);
    }
    this.ctx.body = { success: true, users };
  }
  async focus() {
    const { user } = this.ctx;
    const { uid } = this.ctx.request.body;
    if (!user) {
      this.ctx.body = { success: false, message: '未获得到user' };
      return;
    }
    if (!user._id) {
      this.ctx.body = { success: false, message: '未获得到_id' };
      return;
    }
    // 判断一下该用户是否已经关注了此User
    for (const focusUser of user.focus) {
      if (focusUser.uid == uid) {
        this.ctx.body = { success: false, message: '不可重复关注' };
        return;
      }
    }
    const updateRes = await this.ctx.model.User.update({ _id: user._id }, { $push: { focus: { uid } } });
    if (updateRes.ok === 1) {
      // 在目标user的follower中添加此user
      // FIX
      const updateRes2 = await this.ctx.model.User.update({ _id: uid }, { $push: { followers: { uid: user._id } } });
      const newUser = await this.ctx.model.User.findOne({ _id: user._id });
      this.ctx.body = { success: true, focus: newUser.focus };
      return;
    }
    this.ctx.body = { success: false };
    return;
  }

  async cancelFocus() {
    const { user } = this.ctx;
    const { uid } = this.ctx.request.body;
    if (!user) {
      this.ctx.body = { success: false, message: '未获得到user' };
      return;
    }
    if (!user._id) {
      this.ctx.body = { success: false, message: '未获得到_id' };
      return;
    }

    const updateRes = await this.ctx.model.User.update({ _id: user._id }, { $pull: { focus: { uid } } });
    if (updateRes.ok === 1) {
      // FIX
      const updateRes2 = await this.ctx.model.User.update({ _id: uid }, { $pull: { followers: { uid: user._id } } });
      const newUser = await this.ctx.model.User.findOne({ _id: user._id });
      this.ctx.body = { success: true, focus: newUser.focus };
      return;
    }
    this.ctx.body = { success: false };
    return;
  }

  async shields() {
    const { user } = this.ctx;
    const { uid } = this.ctx.request.body;
    if (!user) {
      this.ctx.body = { success: false, message: '未获得到user' };
      return;
    }
    if (!user._id) {
      this.ctx.body = { success: false, message: '未获得到_id' };
      return;
    }
    // 判断一下该用户是否已经关注了此User
    for (const focusUser of user.shields) {
      if (focusUser.uid == uid) {
        this.ctx.body = { success: false, message: '不可重复屏蔽' };
        return;
      }
    }
    const updateRes = await this.ctx.model.User.update({ _id: user._id }, { $push: { shields: { uid } } });
    if (updateRes.ok === 1) {
      const newUser = await this.ctx.model.User.findOne({ _id: user._id });
      this.ctx.body = { success: true, shields: newUser.shields };
      return;
    }
    this.ctx.body = { success: false };
    return;
  }

  async cancelShields() {
    const { user } = this.ctx;
    const { uid } = this.ctx.request.body;
    if (!user) {
      this.ctx.body = { success: false, message: '未获得到user' };
      return;
    }
    if (!user._id) {
      this.ctx.body = { success: false, message: '未获得到_id' };
      return;
    }

    const updateRes = await this.ctx.model.User.update({ _id: user._id }, { $pull: { shields: { uid } } });
    if (updateRes.ok === 1) {
      const newUser = await this.ctx.model.User.findOne({ _id: user._id });
      this.ctx.body = { success: true, shields: newUser.shields };
      return;
    }
    this.ctx.body = { success: false };
    return;
  }
  async readNotify() {
    const { notifies } = this.ctx.request.body;
    for (const notify of notifies) {
      await this.ctx.model.Notify.update({ _id: notify._id }, { hasRead: true });
    }
    this.ctx.body = { success: true };
  }

  async readPraise() {
    const { threads, comments } = this.ctx.request.body;
    console.log(threads, comments);
    if (threads.length > 0) {
      for (const thread of threads) {
        for (const notReadPraiseInfo of thread.notReadPraiseInfo) {
          const res = await this.ctx.model.Thread.update({ _id: thread._id }, { $pull: { notReadPraiseInfo: { _id: notReadPraiseInfo._id } } });
          console.log('移除结果', res);
        }
      }
    }
    if (comments.length > 0) {
      for (const comment of comments) {
        for (const notReadPraiseInfo of comment.notReadPraiseInfo) {
          const res = await this.ctx.model.Comment.update({ _id: comment._id }, { $pull: { notReadPraiseInfo: { _id: notReadPraiseInfo._id } } });
          console.log('移除结果', res);
        }
      }
    }
    this.ctx.body = 'ok';
  }

  async getOldNotifies() {
    // 按照时间排序
    const { user } = this.ctx;
    const { objectId } = this.ctx.request.query;
    console.log('前来获取oldNotify', user._id, objectId);
    if (!objectId) {
      const oldNotifies = await this.ctx.model.Notify.find({ uid: user._id, hasRead: true }).limit(15).sort({ _id: -1 });
      this.ctx.body = { success: true, oldNotifies };
      console.log(oldNotifies);
      return;
    }
    const oldNotifies = await this.ctx.model.Notify.find({ _id: { $lt: objectId }, uid: user._id, hasRead: true }).limit(15).sort({ _id: -1 });
    this.ctx.body = { success: true, oldNotifies };
    return;
  }

}

module.exports = UserController;
