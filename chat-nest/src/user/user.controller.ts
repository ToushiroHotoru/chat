import {
  Sse,
  Get,
  Post,
  Body,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

// import { IsAdmin } from '@/utils/@isAdmin';
import { UserService } from './user.service';
import { UserDto, UserDtoPost, UserDtoPatch } from './user.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private UserService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Получить пользователей' })
  @ApiQuery({
    name: 'userNotId',
    required: false,
    description: 'id пользователя',
  })
  async read(@Query('userNotId') userNotId: string): Promise<UserDto[]> {
    return await this.UserService.read(userNotId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя' })
  @ApiParam({ name: 'id', required: true, description: 'id пользователя' })
  async readOne(@Param('id') id: string) {
    return await this.UserService.readOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Создать пользователя' })
  async create(@Body() body: UserDtoPost) {
    return await this.UserService.create(body);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiParam({ name: 'id', required: true, description: 'id пользователя' })
  async update(@Param('id') id: string, @Body() body: UserDtoPatch) {
    return await this.UserService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', required: true, description: 'id пользователя' })
  async delete(@Param('id') id: string) {
    return await this.UserService.delete(id);
  }
}
