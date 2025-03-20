import { Schema, model } from 'mongoose';
import { ChatDto } from './chat.dto';

export const ChatSchema = new Schema({
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'user', required: true }],
});

export const ChatModel = model<ChatDto>('chat', ChatSchema, 'chats');
