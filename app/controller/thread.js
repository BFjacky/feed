'use strict';

const Controller = require('egg').Controller;

class ThreadController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async newThread() {
    const cond = this.ctx.request.body;
    console.log(cond);
    this.ctx.body = '发布了一个新的thread';
  }
}

module.exports = ThreadController;
