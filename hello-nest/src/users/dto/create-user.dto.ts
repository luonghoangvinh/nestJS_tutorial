import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
        description: 'Tên người dùng',
        example: 'john_doe',
    })
  username!: string;

  @IsEmail()
  @MaxLength(255)
  @ApiProperty({
        description: 'Email',
        example: 'john@gmail.com',
    })
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @ApiProperty({
        description: 'Mật khẩu',
        example: 'password123',
    })
  password!: string;
}
