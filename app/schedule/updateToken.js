'use strict';
const Subscription = require('egg').Subscription;

class UpdateToken extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: 1000 * 60 * 60 * 1.5, // 1.5 小时间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // const res = await this.ctx.curl('http://www.api.com/cache', {
    //   dataType: 'json',
    // });
    // this.ctx.app.cache = res.data;
  }
}

module.exports = UpdateToken;
