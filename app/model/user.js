'use strict';

module.exports = app => {
  const { mongoose } = app;
  const UserSchema = new mongoose.Schema({
    avatar: { type: String },
    gender: { type: Number }, // 女性为 0， 男性为 1
    nickname: { type: String },
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  return mongoose.model('User', UserSchema);
};
