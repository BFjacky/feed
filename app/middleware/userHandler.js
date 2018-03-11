'use strict';
// app/middleware/userHandler.js
const axios = require('axios');

module.exports = () => async function(ctx, next) {
  if (ctx.request.header.authorization === undefined) {
    //
    console.log('非小程序跳转路由');
    // 非小程序跳转过来的路由
    await next();
    return;
  }
  console.log('进入中间件');
  const regexpResult = ctx.request.header.authorization.match(/\S+/g);
  const accountToken = regexpResult[1];
  // 根据获得的accountToken查询本地数据库是否存在一个用户的accountToken为此用户
  let userId = await ctx.app.redis.get(accountToken);
  if (userId === null) {
    // 本地redis数据库中没有此userId则向网站访问获得此用户的信息
    try {
      const userResult = await axios({
        url: `${ctx.app.config.url.token_account}${accountToken}`,
      });
      // 已经获得userId
      userId = userResult.data._id;
      await ctx.app.redis.set(accountToken, userId);
    } catch (err) {
      ctx.body = { success: false, message: 'accountToken已过期' };
      return;
    }
  }


  // 根据ctx.user.id在数据库中查询该用户的教务处user信息
  const user = await ctx.model.User.findOne({ _id: userId });
  ctx.middleUser = user;
  if (ctx.middleUser === null) {
    ctx.middleUser = {};
    ctx.middleUser.id = userId;
  }
  await next();

  console.log('离开中间件');
};
