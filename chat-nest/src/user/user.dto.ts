import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: '89fu49h30f9hh9324' })
  _id: string;
  @ApiProperty({ example: 'tolyan' })
  login: string;
  @ApiProperty({ example: 'big' })
  password: string;
}

export class UserDtoPost {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Поле login отсутствует' })
  login: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Поле password отсутствует' })
  password: string;
}

export class UserDtoPatch {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  login?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;
}