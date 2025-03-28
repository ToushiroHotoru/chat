import { Module } from '@nestjs/common';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
