'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    console.log(this.ctx.url);
    // 进行用户鉴权判定
    console.log('here');
    this.ctx.body = '123';
  }
}

module.exports = HomeController;
