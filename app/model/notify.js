'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema } = mongoose;
  const NotifySchema = new mongoose.Schema({
    uid: { type: Schema.Types.ObjectId },
    hasRead: Boolean,
    threadSourceId: { type: Schema.Types.ObjectId, ref: 'Thread' }, // 通知所属的thread
    commentSourceId: { type: Schema.Types.ObjectId, ref: 'Comment' }, // 通知所属的comment
    // : { avatarUrl: String, uid: Schema.Types.ObjectId, nickName: String },
    sourceContent: String, // 这条通知所属的正文主体
    commentInfo: { avatarUrl: String, uid: Schema.Types.ObjectId, nickName: String, content: String },
    imgs: [{
      aid: Schema.Types.ObjectId, // attachment id
      key: String, // attachment的路径名，例如feed/${date}/${md5}.${ext}   //原attachment字段
      isGif: Boolean, // 是否是动图
      height: Number, // 图片高度
      width: Number, // 图片宽度
      url: String, // 图片缩略图地址，上传到七牛后得到的地址
      urlMiddle: String,
      sourceUrl: String, // 原图地址，上传到七牛后得到的地址
    }],
    commentId: Schema.Types.ObjectId, // 这条通知 是由 哪一个comment 引起的
    comment: Boolean,
    praise: Boolean,
    focus: Boolean,
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  return mongoose.model('Notify', NotifySchema);
};
