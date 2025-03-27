import { Injectable, ForbiddenException } from '@nestjs/common';

import { isValid } from '@/utils/isValid';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserService } from '@/user/user.service';
import * as jwt from 'jsonwebtoken';
import { UserDto } from '@/user/user.dto';

@Injectable()
export class AuthService {
  constructor(private UserService: UserService) {}

  async login(body: LoginDto) {
    try {
      const { login, password } = body;
      const isExists: UserDto | null =
        await this.UserService.readOneByLogin(login);
      if (!isExists) throw new ForbiddenException('User not found');

      const isValidPass: boolean = isExists.password === password;
      if (!isValidPass) throw new ForbiddenException('Invalid password');

      const token = jwt.sign({ ...isExists }, 'shhhhh');

      return { jwt: token };
    } catch (err) {
      console.log(err);
    }
  }

  async register(body: RegisterDto) {
    const { login, password } = body;

    const isExists: UserDto | null =
      await this.UserService.readOneByLogin(login);
    if (isExists) throw new ForbiddenException('User already exists');

    const isValidPass: boolean = /^[a-zA-Z0-9]{3,10}$/.test(password);
    if (!isValidPass) throw new ForbiddenException('Invalid password');

    const newUser: UserDto = await this.UserService.create({ login, password });

    const token = jwt.sign({ ...newUser }, 'shhhhh');

    return { jwt: token };
  }

  async isAuthorized(token: string) {
    try {
      const user = jwt.verify(token, 'shhhhh');

      return user;
    } catch (e) {
      throw new ForbiddenException('Unauthorized request');
    }
  }
}
