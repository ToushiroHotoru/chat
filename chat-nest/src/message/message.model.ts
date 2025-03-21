import { Schema, model } from 'mongoose';
import { MessageDto } from './message.dto';

export const MessageSchema = new Schema(
  {
    index: { type: Number, required: false, index: 1 },
    text: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'chat', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true },
);

MessageSchema.pre('save', async function (next) {
  if (!this.index) {
    const highestIndexGroup = await MessageModel.findOne({}).sort({
      index: 1,
    });
    this.index = (highestIndexGroup && highestIndexGroup.index + 1) || 1;
  }
  next();
});

export const MessageModel = model<MessageDto>(
  'message',
  MessageSchema,
  'messages',
);
