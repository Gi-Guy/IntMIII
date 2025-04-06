import mongoose, { Schema } from 'mongoose';
import { Gender } from '../types/user.type';

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  registeredAt: {
    type: Number,
    required: true
  }
});

export const UserModel = mongoose.model('User', userSchema);