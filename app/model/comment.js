'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema } = mongoose;
  const CommentSchema = new mongoose.Schema({
    threadSourceId: { type: Schema.Types.ObjectId, ref: 'Thread' }, // 这条comment所属的thread
    commentSourceId: { type: Schema.Types.ObjectId, ref: 'Comment' }, // 这条comment所属的comment
    audio: {
      aid: Schema.Types.ObjectId, // attachment id
      duration: Number, // 语音时长，单位秒
      url: String, // 音频地址，上传到七牛后得到的地址
    },
    uid: Schema.Types.ObjectId, // uid
    nickName: String, // user nickName
    avatarUrl: String, // 直接把发送者的头像地址赋值过来，先不用考虑用户换头像后不同步的问题
    comments: Number, // 此条comment的评论总数
    commentInfo: [{ avatarUrl: String, uid: Schema.Types.ObjectId, content: String, nickName: String }], //
    content: { type: String, maxlength: 300 }, // 内容
    images: [{
      aid: Schema.Types.ObjectId, // attachment id
      attachment: String, // attachment的路径名，例如feed/${date}/${md5}.${ext}
      isGif: Boolean, // 是否是动图
      height: Number, // 图片高度
      width: Number, // 图片宽度
      url: String, // 图片缩略图地址，上传到七牛后得到的地址
      sourceUrl: String, // 原图地址，上传到七牛后得到的地址
    }],
    praises: Number, // 点赞数
    praiseInfo: [{ avatarUrl: String, uid: Schema.Types.ObjectId }], // 同样直接赋值头像地址
    views: Number, // 此条comment的查看量，暂不实现

    hasPraised: Boolean, // 是否已经点过赞
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  return mongoose.model('Comment', CommentSchema);
};
