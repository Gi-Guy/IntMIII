import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  postId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    required: true
  },
  author: {
    id: { type: String, required: true },
    username: { type: String, required: true }
  }
});

export const CommentModel = mongoose.model('Comment', commentSchema);
