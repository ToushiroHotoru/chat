import { Injectable, ForbiddenException } from '@nestjs/common';

import { MessageModel } from './message.model';
import { isValid } from '@/utils/isValid';
import { MessageDto, MessageDtoPost, MessageDtoPatch } from './message.dto';

@Injectable()
export class MessageService {
  async create(body: MessageDtoPost): Promise<MessageDto> {
    return MessageModel.create(body);
  }

  async read() {
    return MessageModel.find({});
  }

  async readOne(id: string) {
    await isValid(id, MessageModel);
    return MessageModel.findOne({ _id: id });
  }

  async update(id: string, body: MessageDtoPatch) {
    await isValid(id, MessageModel);

    return MessageModel.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true },
    );
  }

  async delete(id: string) {
    await isValid(id, MessageModel);

    return MessageModel.deleteOne({ _id: id });
  }
}
