'use strict';
const Service = require('egg').Service;

class utilsService extends Service {
  async getUidByOpenid(openid) {
    const user = await this.ctx.model.User.findOne({ openid });
    if (user) {
      return user._id;
    }

    return '';

  }
}

module.exports = utilsService;
