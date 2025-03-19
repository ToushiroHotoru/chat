import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'tolyan' })
  @IsString()
  @IsNotEmpty({ message: 'Поле login отсутствует' })
  login: string;
  @IsString()
  @IsNotEmpty({ message: 'Поле password отсутствует' })
  @ApiProperty({ example: 'big' })
  password: string;
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Поле login отсутствует' })
  login: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Поле password отсутствует' })
  password: string;
}
