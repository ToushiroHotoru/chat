import {
  Sse,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UsePipes,
  UseGuards,
  Controller,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

// import { IsAdmin } from '@/utils/@isAdmin';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Авторизация' })
  async login(@Body() body: LoginDto) {
    return await this.AuthService.login(body);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Регистрация' })
  async register(@Body() body: RegisterDto) {
    return await this.AuthService.register(body);
  }

  @Post('/isAuthorized')
  @ApiOperation({ summary: 'Проверка авторизации' })
  async isAuthorized(@Body() body: { token: string }) {
    return await this.AuthService.isAuthorized(body.token);
  }
}
