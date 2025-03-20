import { Schema, model } from 'mongoose';
import { MessageDto } from './message.dto';

export const MessageSchema = new Schema(
  {
    index: { type: Number, required: true },
    text: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'chat', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true },
);

export const MessageModel = model<MessageDto>(
  'message',
  MessageSchema,
  'messages',
);
