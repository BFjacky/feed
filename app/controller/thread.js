'use strict';

const Controller = require('egg').Controller;

class ThreadController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async newThread() {
    const { thread } = this.ctx.request.body;
    const { feedCookie, user } = this.ctx;
    if (!user) {
      this.ctx.body = { success: false, message: '未获得到user' };
      return;
    }
    if (!user.openid) {
      this.ctx.body = { success: false, message: '未获得到openid' };
      return;
    }
    const threadData = new this.ctx.model.Thread({ openid: user.openid, content: thread.content, imgs: thread.imgs, themeText: thread.themeText });
    await threadData.save();
    this.ctx.body = { success: true };
  }
  async newComment() {
    const { comment } = this.ctx.request.body;
    const user = this.ctx.middleUser;
  }
  async getThread() {
    /**
     *  获得thread按照不同方式获得 qycode
     * 0 : 按照时间排序
     * 1 : 按照热度排序
     * 2 : 选择关注人的thread
     */
    const { qycode } = this.ctx.request.body;
    /** FIX ME
        获得不同内容类别的thread   tpcode
        '无主题': 0,
        '二手交易': 1,
        '表白墙': 2,
        '拼车': 3,
        '失物招领': 4
     */
    const { tpcode } = this.ctx.request.body;
    // 按照时间排序
    if (qycode === 0) {
      if (tpcode === 0) {
        // 未选择类别，则获得全体thread
        const threads = await this.ctx.model.Thread.find().limit(5);
        for (const thread of threads) {
          console.log(thread.createdAt);
        }
        console.log('-------------------------------------------');
        const allthreads = await this.ctx.model.Thread.find();
        for (const thread of allthreads) {
          console.log(thread.createdAt);
        }
      }
    }
  }
}

module.exports = ThreadController;
