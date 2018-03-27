'use strict';

module.exports = app => {
  const { mongoose } = app;
  const UserSchema = new mongoose.Schema({
    openid: { type: String },
    avatarUrl: { type: String },
    gender: { type: Number }, // 女性为 2， 男性为 1
    nickName: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    userId: { type: String }, // 对应用户的小程序一键登陆Id
    feedCookie: { type: String }, // 该用户的feedCookie
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  return mongoose.model('User', UserSchema);
};
