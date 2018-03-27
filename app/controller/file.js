'use strict';

const moment = require('moment');
const crypto = require('crypto');
const Controller = require('egg').Controller;

class FileController extends Controller {
  async transfer() {
    const { qiniu2 } = this.app;
    const { from, filename } = this.ctx.request.body;
    const md5 = crypto.createHash('md5').update(filename + +new Date()).digest('hex');
    const ext = filename.split('.').pop();
    const key = `${from}/${moment().format('YYYYMMDD')}/${md5}.${ext}`;

    const { domain, urlKey1 } = this.app.config.qiniu2;

    // FIXME
    const deadline = 1577811600;

    const cdnManager = new qiniu2.cdn.CdnManager(null);
    const sourceUrl = cdnManager.createTimestampAntiLeechUrl(domain, key, null, urlKey1, deadline);
    const url = cdnManager.createTimestampAntiLeechUrl(domain, key + '/w200', null, urlKey1, deadline);
    const urlMiddle = cdnManager.createTimestampAntiLeechUrl(domain, key + '/w500', null, urlKey1, deadline);
    console.log(`上传图片:${urlMiddle}`);
    const { bucket } = this.app.config.qiniu2.client;
    const options = {
      scope: `${bucket}:${key}`,
      returnBody: `{"key":"$(key)","sourceUrl":"${sourceUrl}","url":"${url}","urlMiddle":"${urlMiddle}","fsize":$(fsize),"code": 0}`,
    };

    const putPolicy = new qiniu2.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(qiniu2.mac);

    this.ctx.body = { key, token };
  }
}

module.exports = FileController;
