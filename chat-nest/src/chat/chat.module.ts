import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { DatabaseModule } from '@/database.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessageModule } from '@/message/message.module';
import { MessageService } from '@/message/message.service';

@Module({
  imports: [DatabaseModule, MessageModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, MessageService],
})
export class ChatModule {}
