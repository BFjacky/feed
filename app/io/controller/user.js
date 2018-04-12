'use strict';


module.exports = app => {
  class Controller extends app.Controller {
    async init() {
      console.log('init...');

      const uid = this.ctx.args[0];
      if (!uid) {
        return;
      }
      const user = await this.ctx.model.User.findOne({ _id: uid });
      if (!user) {
        return;
      }
      const notifies = await this.ctx.model.Notify.find({ uid, hasRead: false }).sort({ _id: -1 });
      this.ctx.socket.emit('res', notifies);

      const Emitter = this.ctx.service.event.Emitter();
      Emitter.on('newNotify', async sourceUid => {
        if (sourceUid == uid) {
          // notify目标为此用户
          const notifies = await this.ctx.model.Notify.find({ uid, hasRead: false }).sort({ _id: -1 });
          this.ctx.socket.emit('res', notifies);
        }
      });

    }
    async adminLogin() {
      // this.ctx.socket.disconnect(true);
      const argspswd = this.ctx.args[0];
      const pswd = 'jserjser';
      await this.ctx.app.redis.set(this.ctx.socket.id, true);
      if (argspswd === pswd) {
        this.ctx.socket.emit('loginResult', 'success');
        // 管理员登陆成功后，开始监听 新thread 的变化
        console.log('登陆成功开始监听');
        const Emitter = this.ctx.service.event.Emitter();
        Emitter.on('newThread', async thread => {
          this.ctx.socket.emit('newThread', thread);
        });
      } else {
        this.ctx.socket.emit('loginResult', 'fail');
      }
    }
  }
  return Controller;
};
