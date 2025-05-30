import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
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
  },
  isLocked: {
    type: Boolean,
    required: true,
    default: false
  },
  likes: {
    type: [String],
    default: []
  },
});

export const PostModel = mongoose.model('Post', postSchema);
