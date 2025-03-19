import { Schema, model } from 'mongoose';
import { UserDto } from './user.dto';

export const UserSchema = new Schema(
  {
    login: { type: String, required: true },
    password: { type: String, required: true },
  },
  // { timestamps: true },
);

export const UserModel = model<UserDto>('user', UserSchema, 'Users');