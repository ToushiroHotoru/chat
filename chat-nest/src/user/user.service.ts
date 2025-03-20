import { Injectable, ForbiddenException } from '@nestjs/common';

import { UserModel } from './user.model';
import { isValid } from '@/utils/isValid';
import { UserDto, UserDtoPost, UserDtoPatch } from './user.dto';

@Injectable()
export class UserService {
  async create(body: UserDtoPost): Promise<UserDto> {
    return UserModel.create(body);
  }

  async read() {
    return UserModel.find({});
  }

  async readOne(id: string) {
    await isValid(id, UserModel);
    return UserModel.findOne({ _id: id });
  }

  async readOneByLogin(login: string) {
    return UserModel.findOne({ login: login });
  }

  async update(id: string, body: UserDtoPatch) {
    await isValid(id, UserModel);

    return UserModel.findOneAndUpdate({ _id: id }, { ...body }, { new: true });
  }

  async delete(id: string) {
    await isValid(id, UserModel);

    return UserModel.deleteOne({ _id: id });
  }
}
