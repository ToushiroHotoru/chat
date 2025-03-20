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
import { ChatService } from './chat.service';
import { ChatDto, ChatDtoPost, ChatDtoPatch } from './chat.dto';

@ApiTags('chats')
@Controller('chats')
@ApiBearerAuth()
export class ChatController {
  constructor(private ChatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Получить чаты' })
  async read(): Promise<ChatDto[]> {
    return await this.ChatService.read();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить чат' })
  @ApiParam({ name: 'id', required: true, description: 'id чата' })
  async readOne(@Param('id') id: string) {
    return await this.ChatService.readOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Создать чат' })
  async create(@Body() body: ChatDtoPost) {
    return await this.ChatService.create(body);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Обновить чат' })
  @ApiParam({ name: 'id', required: true, description: 'id чата' })
  async update(@Param('id') id: string, @Body() body: ChatDtoPatch) {
    return await this.ChatService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить чат' })
  @ApiParam({ name: 'id', required: true, description: 'id чата' })
  async delete(@Param('id') id: string) {
    return await this.ChatService.delete(id);
  }
}
