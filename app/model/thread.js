'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema } = mongoose;
  const ThreadSchema = new mongoose.Schema({
    openid: String,
    avatarUrl: String,
    nickName: String,
    audio: {
      aid: Schema.Types.ObjectId, // attachment id
      duration: Number, // 语音时长，单位秒
      url: String, // 音频地址，上传到七牛后得到的地址
    },
    content: { type: String, maxlength: 300 }, // 内容
    imgs: [{
      aid: Schema.Types.ObjectId, // attachment id
      key: String, // attachment的路径名，例如feed/${date}/${md5}.${ext}   //原attachment字段
      isGif: Boolean, // 是否是动图
      height: Number, // 图片高度
      width: Number, // 图片宽度
      url: String, // 图片缩略图地址，上传到七牛后得到的地址
      sourceUrl: String, // 原图地址，上传到七牛后得到的地址
    }],
    comments: Number, // 此条thread的评论总数
    commentInfo: [{ avatarUrl: String, openid: String, content: String}], // 评论的详细信息
    praises: Number, // 点赞数
    praiseInfo: [{ avatarUrl: String, openid: String }], // 同样直接赋值头像地址
    views: Number, // 此条thread的查看量，暂不实现
    themeText: String, // 此条thread所属的类别，中文描述
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  ThreadSchema.virtual('commentList')
    .get(function () {
      return this._commentList;
    })
    .set(function (_commentList) {
      this._commentList = _commentList;
      return this._commentList;
    });

  return mongoose.model('Thread', ThreadSchema);
};
