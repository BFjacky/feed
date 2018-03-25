

'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');
class UserController extends Controller {
  async get() {
    // 获得当前用户信息
    const { user } = this.ctx;
    this.ctx.body = user;
  }
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
            const notifies = await _this.ctx.model.Notify.find({ uid: user._id }).sort({ _id: -1 });
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
      let notifies = await this.ctx.model.Notify.find({ uid: user._id }).sort({ _id: -1 });
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

}

module.exports = UserController;
