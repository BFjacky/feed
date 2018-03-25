'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
class utilsService extends Service {
  async getUidByOpenid(openid) {
    const user = await this.ctx.model.User.findOne({ openid });
    if (user) {
      return user._id;
    }

    return '';

  }
  // 检查一个数组中所有的threads || comments 是否被该用户点过赞，并添加hasPraised字段
  checkPraised(array, userId) {
    for (const ele of array) {
      for (const info of ele.praiseInfo) {
        if (_.isEqual(info.uid, userId)) {
          ele.hasPraised = true;
          break;
        }
      }
    }
    return array;
  }
  // 检查该用户是否为此条thread || comment 点过了赞，返回boolean
  checkOnePraised(obj, userId) {
    for (const info of obj.praiseInfo) {
      if (_.isEqual(info.uid, userId)) {
        console.log('点过赞了');
        return true;
      }
    }
    console.log('没没没点过赞了');
    return false;
  }

  // 为notifies 添加 正文主体 字段
  async getContents(notifies) {
    for (const notify of notifies) {
      if (notify.threadSourceId) {
        const thread = await this.ctx.model.Thread.findOne({ _id: notify.threadSourceId });
        notify.sourceContent = thread.content;
      }
      if (notify.commentSourceId) {
        const comment = await this.ctx.model.Comment.findOne({ _id: notify.commentSourceId });
        notify.sourceContent = comment.content;
      }
    }
    return notifies;
  }
}

module.exports = utilsService;
