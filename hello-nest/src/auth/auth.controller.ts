import {
    Body,
    Controller,
    Header,
    Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    @Header('Cache-Control', 'no-store')
    @Header('Pragma', 'no-cache')
    @Header('Expires', '0')
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Post('signup')
    @Header('Cache-Control', 'no-store')
    @Header('Pragma', 'no-cache')
    @Header('Expires', '0')
    signup(@Body() createAccountDto: CreateUserDto) {
        return this.authService.signup(createAccountDto);
    }

    @Post('logout')
    @Header('Cache-Control', 'no-store')
    @Header('Pragma', 'no-cache')
    @Header('Expires', '0')
    logout(@Body('token') token: string) {
        return this.authService.logout(token);
    }
}