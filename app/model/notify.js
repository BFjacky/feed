'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema } = mongoose;
  const NotifySchema = new mongoose.Schema({
    uid: { type: Schema.Types.ObjectId },
    hasRead: Boolean,
    threadSourceId: { type: Schema.Types.ObjectId, ref: 'Thread' }, // 通知所属的thread
    commentSourceId: { type: Schema.Types.ObjectId, ref: 'Comment' }, // 通知所属的comment

    commentInfo: { avatarUrl: String, uid: Schema.Types.ObjectId, nickName: String, content: String },
    commentId: Schema.Types.ObjectId,
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

  return mongoose.model('Notify', NotifySchema);
};
