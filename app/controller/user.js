'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async sync() {
    const { feedUserInfo } = this.ctx.request.body;
    const _id = this.ctx.middleUser.id;
    if (!_id || !feedUserInfo) {
      this.ctx.body = {
        success: false,
        message: 'userid 或 userInfo 为空',
      };
      return;
    }
    // 将新的信息存入到数据库中
    const { nickName, gender, avatarUrl } = feedUserInfo;
    const updateRes = await this.ctx.model.User.update({ _id }, { nickName, gender, avatarUrl }, { upsert: true, mutil: true });
    if (updateRes.ok === 1) {
      this.ctx.body = { success: true, message: '已经同步了此用户的信息' };
      return;
    }
    this.ctx.body = { success: false, message: '同步feedUserInfo插入数据库时出现了错误' };
  }
}

module.exports = UserController;
