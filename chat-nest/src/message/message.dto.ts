import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class MessageDto {
  @ApiProperty({ example: '89fu49h30f9hh9324' })
  _id: string;
  @ApiProperty({ example: 1 })
  index: number;
  @ApiProperty({ example: 'hello' })
  text: string;
  @ApiProperty({ example: 'false' })
  isEdited: boolean;
  @ApiProperty({ example: '89fu49h30f9hh9324' })
  chatId: string;
  @ApiProperty({ example: '89fu49h30f9hh9324' })
  userId: string;
  @ApiProperty({ example: 'date obj' })
  createdAt: Date;
  @ApiProperty({ example: 'date obj' })
  updatedAt: Date;
}

export class MessageDtoPost {
  @ApiProperty()
  @IsNumber()
  @IsOptional({ message: 'Поле index отсутствует' })
  index?: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Поле text отсутствует' })
  text: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Поле chatId отсутствует' })
  chatId: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Поле userId отсутствует' })
  userId: string;
}

export class MessageDtoPatch {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  index?: number;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  text?: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isEdited?: boolean;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chatId?: string;
  @ApiProperty()
  @IsString()
  @IsOptional({ message: 'Поле userId отсутствует' })
  userId?: string;
}
