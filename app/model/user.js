'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema } = mongoose;
  const UserSchema = new mongoose.Schema({
    openid: { type: String },
    avatarUrl: { type: String },
    gender: { type: Number }, // 女性为 2， 男性为 1
    nickName: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    minaId: { type: String }, // 对应用户的小程序一键登陆Id
    feedCookie: { type: String }, // 该用户的feedCookie
    pass: Boolean, // 及格认证,通过答题测试才可以发状态
    followers: [{ uid: Schema.Types.ObjectId }], // 追随者
    focus: [{ uid: Schema.Types.ObjectId }], // 关注者
    collects: [{ threadId: Schema.Types.ObjectId }], // 收藏的动态
    shields: [{ uid: Schema.Types.ObjectId }], // 屏蔽的人
    onlyself: Boolean, // 只有自己能看到 (惩罚限制);
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  return mongoose.model('User', UserSchema);
};
