'use strict';


module.exports = app => {
  class Controller extends app.Controller {
    async init() {
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
  }
  return Controller;
};
