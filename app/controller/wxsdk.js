'use strict';
const crypto = require('crypto');
const Controller = require('egg').Controller;
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// const config = {
//   appId: 'wx9fd6bbc89436a5ee',
//   appSecret: '338e4bea61cc75fe5f69ad9a1416e893',
//   jsUrl: 'http://myccc.feit.me/',
// };
const config = {
  appId: 'wx3ff5c48ba9ac6552',
  appSecret: '4e7735e37c9c493a5ead5cb07c6cd6fd',
  jsUrl: 'https://neau-lib.xiaonei.io/feed',
};
// 缓存access_token
class wxsdkController extends Controller {
  async sign() {
    const { nonceStr, timestamp } = this.ctx.request.query;
    let access_token = await this.ctx.app.redis.get('accessToken');
    const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${config.appId}&secret=${config.appSecret}`;
    const ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    // 收次请求获得ticket
    let ticketRes = await axios({
      url: ticketUrl,
    });
    // errcode 为 0 则说明成功了
    if (ticketRes.data.errcode !== 0) {
      // 失败原因 多数为 accessToken过期
      const tokenRes = await axios({
        url: tokenUrl,
      });
      const newAccessToken = tokenRes.data.access_token;
      await this.ctx.app.redis.set('accessToken', newAccessToken);
      access_token = await this.ctx.app.redis.get('accessToken');
      // 再次请求获得ticket
      ticketRes = await axios({
        url: ticketUrl,
      });
    }
    const ticket = ticketRes.data.ticket;
    if (ticketRes.data.errcode !== 0) {
      console.log('再一次sign wx-sdk 失败,无法获得ticket');
      this.ctx.body = { success: false, message: '再一次sign wx-sdk 失败,无法获得ticket' };
      return;
    }

    const finalStr = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + config.jsUrl;
    const signature = crypto.createHash('sha1').update(finalStr).digest('hex');
    this.ctx.body = { signature };

  }

  async oauth() {
    try {
      const { code } = this.ctx.request.query;
      // 获取用户的access_token
      const access_token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appId}&secret=${config.appSecret}&code=${code}&grant_type=authorization_code`;
      const accessTokenRes = await axios({
        url: access_token_url,
      });
      const { openid, access_token, refresh_token } = accessTokenRes.data;
      // 使用access_token 获得用户信息
      const user_info_url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
      const userInfoRes = await axios({
        url: user_info_url,
      });
      const { nickname, sex, province, city, country, headimgurl, privilege, unionid } = userInfoRes.data;
      // 获得此用户的cookie串,存入数据库中
      const { feedCookie } = this.ctx;
      console.log('oauth鉴权213:', feedCookie, userInfoRes.data);
      await this.ctx.model.User.update({ openid }, { avatarUrl: headimgurl, gender: sex, nickName: nickname, city, province, country, feedCookie }, { mutil: true, upsert: true });
      // 鉴定该access_token 是否有效
      // code...


      // 使用refresh_token 获得 有效的 access_token
      // code...
      const res = fs.readFileSync(path.join(__dirname, '../public', '/index.html'));
      this.ctx.response.append('content-type', 'text/html');
      this.ctx.response.body = res;
    } catch (err) {
      // FIX ME  授权失败如何操作
      const res = fs.readFileSync(path.join(__dirname, '../public', '/index.html'));
      this.ctx.response.append('content-type', 'text/html');
      this.ctx.response.body = res;
    }
  }

}
module.exports = wxsdkController;
