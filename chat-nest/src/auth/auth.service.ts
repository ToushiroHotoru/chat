import { Injectable, ForbiddenException } from '@nestjs/common';

import { isValid } from '@/utils/isValid';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserService } from '@/user/user.service';
import jwt from 'jsonwebtoken';
import { UserDto } from '@/user/user.dto';

@Injectable()
export class AuthService {
  constructor(private UserService: UserService) {}

  async login(body: LoginDto) {
    const { login, password } = body;
    const isExists: UserDto | null = await this.UserService.readOne(login);
    if (!isExists) throw new ForbiddenException('User not found');

    const isValidPass: boolean = isExists.password === password;
    if (!isValidPass) throw new ForbiddenException('Invalid password');

    return jwt.sign({ ...isExists }, 'shhhhh');
  }

  async register(body: RegisterDto) {
    const { login, password } = body;

    const isExists: UserDto | null = await this.UserService.readOne(login);
    if (isExists) throw new ForbiddenException('User already exists');

    const isValidPass: boolean = /^[a-zA-Z0-9]{3,10}$/.test(password);
    if (!isValidPass) throw new ForbiddenException('Invalid password');

    const newUser: UserDto = await this.UserService.create({ login, password });

    return jwt.sign({ ...newUser }, 'shhhhh');
  }

  async isAuthorized(token: string) {
    try {
      jwt.verify(token, 'shhhhh');
    } catch (e) {
      throw new ForbiddenException('Unauthorized request');
    }
    return true;
  }
}
