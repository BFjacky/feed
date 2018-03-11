'use strict';

module.exports = app => {
  const { mongoose } = app;
  const UserSchema = new mongoose.Schema({
    avatarUrl: { type: String },
    gender: { type: Number }, // 女性为 0， 男性为 1
    nickName: { type: String },
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  return mongoose.model('User', UserSchema);
};
