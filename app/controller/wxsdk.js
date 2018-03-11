'use strict';
const crypto = require('crypto');
const Controller = require('egg').Controller;
const axios = require('axios');
const config = {
  appId: 'wx9fd6bbc89436a5ee',
  appSecret: '338e4bea61cc75fe5f69ad9a1416e893',
  jsUrl: 'http://myccc.feit.me/#/',
};
// 缓存access_token
const access_token = '7_nVA0Hkqe_S9in7jZ3sJyxVph6kg_hBxl5moxmRUyYboMfy6kKiNLbyE6Yi-Rhnk6MtrX-AJHCU1ol3ayhhmcrdlNUs5lQga31sFX8vdS87TPMmXhlYHvjpY8h-Q0a-yDyHbyBpvHHQc3yiyBZOMaADALAY';
const ticket = 'kgt8ON7yVITDhtdwci0qeTBUy1h11jipFl0kX7yhsIktkv1QO-QxoIMi3-ijqS3GIg9pdTt-MgAD8wu5jrZKQw';
const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${config.appId}&secret=${config.appSecret}`;
const ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
class wxsdkController extends Controller {
  async sign() {

    // const tokenRes = await axios({
    //   url: tokenUrl,
    // });
    // console.log(tokenRes.data);

    // const ticketRes = await axios({
    //   url: ticketUrl,
    // });
    // console.log(ticketRes.data);

    const { nonceStr, timestamp } = this.ctx.request.query;
    console.log(nonceStr, timestamp);
    const finalStr = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + config.jsUrl;

    const signature = crypto.createHash('sha1').update(finalStr).digest('hex');
    console.log(signature);
    this.ctx.body = { signature };

  }
}
module.exports = wxsdkController;
