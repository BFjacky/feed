'use strict';
const crypto = require('crypto');
const Controller = require('egg').Controller;
const axios = require('axios');
const config = {
  appId: 'wx9fd6bbc89436a5ee',
  appSecret: '338e4bea61cc75fe5f69ad9a1416e893',
  jsUrl: 'https://neau-lib.xiaonei.io/feed',
};
// 缓存access_token
const access_token = '7_51XmytDGehNLbnzGAVuo2eYY4jxsOav6_e318coUwkLo4ctDzNiJbSbPTpMwSJKwnIoZlvJuGBtN6avPnBmHoz_iNlOh10aUu6KlI4Q4jgarMiPyeHhT9fKQaqvoQecm58avXogNy_oTUwgiAJHdAGAHQO';
const ticket = 'kgt8ON7yVITDhtdwci0qeTBUy1h11jipFl0kX7yhsInbBqnPz7bEvgMLuexwxIi15p2TL9FUXFMTDGa2ipDkgg';
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
    const finalStr = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + config.jsUrl;

    const signature = crypto.createHash('sha1').update(finalStr).digest('hex');
    this.ctx.body = { signature };

  }

  async oauth() {
    try {
      const { code } = this.ctx.request.body;
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
      console.log('oauth鉴权:', feedCookie, userInfoRes.data);
      await this.ctx.model.User.update({ openid }, { avatarUrl: headimgurl, gender: sex, nickName: nickname, city, province, country, feedCookie }, { mutil: true, upsert: true });
      // 鉴定该access_token 是否有效
      // code...


      // 使用refresh_token 获得 有效的 access_token
      // code...
      this.ctx.body = 'oauth 鉴权成功';
    } catch (err) {
      this.ctx.body = 'oauth 鉴权失败';
    }
  }

}
module.exports = wxsdkController;
