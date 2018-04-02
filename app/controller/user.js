

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
  // 获得所有未读通知
  async getNotifyNoRead() {
    // 获得一个用户所有的未读通知
    const { user } = this.ctx;
    const { firstTime } = this.ctx.request.body;
    const _this = this;
    const getNewNotify = async function() {
      let times = 10;
      return new Promise(async (resolve, reject) => {
        const intervalId = setInterval(async () => {
          times--;
          const flag = await _this.ctx.app.redis.get(user._id);
          console.log('redis中:', flag);
          if (flag == 'true') {
            // 已经有新通知了
            const notifies = await _this.ctx.model.Notify.find({ uid: user._id, hasRead: false }).sort({ _id: -1 });
            await _this.ctx.app.redis.set(user._id, false);
            resolve(notifies);
            clearInterval(intervalId);
          }
          if (times <= 0) {
            resolve([]);
            clearInterval(intervalId);
          }
        }, 1000);
      });
    };

    // 如果是第一次来查询 通知 ,则直接返回
    if (firstTime) {
      let notifies = await this.ctx.model.Notify.find({ uid: user._id, hasRead: false }).sort({ _id: -1 });
      notifies = await this.ctx.service.utils.getContents(notifies);
      this.ctx.body = { success: true, notifies };
      await this.ctx.app.redis.set(user._id, false);
      return;
    }
    // 第2-n 次来查询通知，需等新通知事件
    let notifies = await getNewNotify();
    console.log('第二次查询');
    if (notifies.length === 0) {
      this.ctx.body = { success: false, notifies };
      return;
    }
    notifies = await this.ctx.service.utils.getContents(notifies);
    this.ctx.body = { success: true, notifies };
    return;
  }

  async readNotify() {
    const { notifies } = this.ctx.request.body;
    for (const notify of notifies) {
      await this.ctx.model.Notify.update({ _id: notify._id }, { hasRead: true });
    }
    this.ctx.body = { success: true };
  }

}

module.exports = UserController;
