import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsArray } from 'class-validator';

export class ChatDto {
  @ApiProperty({ example: '89fu49h30f9hh9324' })
  _id: string;
  @ApiProperty({ example: 'chat' })
  name: string;
  @ApiProperty({ example: '89fu49h30f9hh9324' })
  users: Array<string>;
}

export class ChatDtoPost {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Поле name отсутствует' })
  name: string;
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: 'Поле users отсутствует' })
  users: Array<string>;
}

export class ChatDtoPatch {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  users?: Array<string>;
}
