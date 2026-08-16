import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
        @IsEmail()
        @ApiProperty({
                description: 'Email đăng nhập',
                example: 'vinh@gmail.com',
        })
        email!: string;

        @IsString()
        @ApiProperty({
                description: 'Mật khẩu',
                example: '123456',
        })
        @MinLength(6)
        password!: string;
}
