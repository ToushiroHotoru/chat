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
import { MessageService } from './message.service';
import { MessageDto, MessageDtoPost, MessageDtoPatch } from './message.dto';

@ApiTags('messages')
@Controller('messages')
@ApiBearerAuth()
export class MessageController {
  constructor(private MessageService: MessageService) {}

  @Get()
  @ApiOperation({ summary: 'Получить пользователей' })
  async read(): Promise<MessageDto[]> {
    return await this.MessageService.read();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить сообщения' })
  @ApiParam({ name: 'id', required: true, description: 'id сообщения' })
  async readOne(@Param('id') id: string) {
    return await this.MessageService.readOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Создать сообщение' })
  async create(@Body() body: MessageDtoPost) {
    return await this.MessageService.create(body);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Редактировать сообщение' })
  @ApiParam({ name: 'id', required: true, description: 'id сообщения' })
  async update(@Param('id') id: string, @Body() body: MessageDtoPatch) {
    return await this.MessageService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить сообщение' })
  @ApiParam({ name: 'id', required: true, description: 'id сообщения' })
  async delete(@Param('id') id: string) {
    return await this.MessageService.delete(id);
  }
}
