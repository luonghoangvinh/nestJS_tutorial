import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthRateLimitGuard } from './auth-rate-limit.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { antiCacheHeaders } from '../users/users.controller';

type SessionRequest = Request & {
  session?: {
    destroy(callback: (error?: unknown) => void): void;
  };
};



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({
        summary: 'Đăng nhập',
        description: 'Xác thực người dùng bằng gmail và mật khẩu. Nếu thành công sẽ trả về JWT token.'
    })
  login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    antiCacheHeaders(res);

    return this.authService.login(body);
  }

  @Post('signup')
  @UseGuards(AuthRateLimitGuard)
  @ApiOperation({
        summary: 'Đăng ký',
        description: 'Đăng kí tài khoản mới'
    })
  signup(
    @Body() createAccountDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    antiCacheHeaders(res);
    return this.authService.signup(createAccountDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
      @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Đăng xuất khỏi hệ thống'
})
  async logout(
    @Req() req: SessionRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    antiCacheHeaders(res);

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    if (req.session) {
      req.session.destroy(() => undefined);
    }

    await this.authService.invalidateToken(token);
    return { message: 'Logout successfully' };
  }
}
