import { Injectable, ForbiddenException } from '@nestjs/common';

import { ChatModel } from './chat.model';
import { isValid } from '@/utils/isValid';
import { ChatDto, ChatDtoPost, ChatDtoPatch } from './chat.dto';

@Injectable()
export class ChatService {
  async create(body: ChatDtoPost): Promise<ChatDto> {
    return ChatModel.create(body);
  }

  async read() {
    return ChatModel.find({});
  }

  async readOne(id: string) {
    await isValid(id, ChatModel);
    return ChatModel.findOne({ _id: id });
  }

  async update(id: string, body: ChatDtoPatch) {
    await isValid(id, ChatModel);

    return ChatModel.findOneAndUpdate({ _id: id }, { ...body }, { new: true });
  }

  async delete(id: string) {
    await isValid(id, ChatModel);

    return ChatModel.deleteOne({ _id: id });
  }
}
