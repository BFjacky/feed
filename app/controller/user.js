'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async get() {
    // 获得当前用户信息
    const { user } = this.ctx;
    console.log('user-get', this.ctx.feedCookie);
    this.ctx.body = user;
  }
}

module.exports = UserController;
