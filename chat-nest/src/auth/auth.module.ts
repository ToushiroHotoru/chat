import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database.module';
import { UserModule } from '../user/user.module';
import { UserService } from '@/user/user.service';
@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
