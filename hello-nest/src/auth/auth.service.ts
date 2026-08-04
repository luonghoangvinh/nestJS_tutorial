import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '../redis/redis.service';

type JwtPayload = {
  exp: number;
  sub?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Register
   */
  async signup(dto: CreateUserDto) {
    const emailExist = await this.usersService.findByEmail(dto.email);

    if (emailExist) {
      throw new ConflictException('Email already exists');
    }

    const usernameExist = await this.usersService.findByUsername(dto.username);

    if (usernameExist) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    return {
      message: 'Register successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async invalidateToken(token: string) {
    const payload = this.jwtService.verify<JwtPayload>(token);

    const now = Math.floor(Date.now() / 1000);

    const ttl = payload.exp - now;

    if (ttl > 0) {
      await this.redisService
        .getClient()
        .set(`blacklist:${token}`, 'true', 'EX', ttl);
    }

    return {
      message: 'Token invalidated successfully',
    };
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.redisService
      .getClient()
      .get(`blacklist:${token}`);

    return blacklisted === 'true';
  }

  async validateUser(id: number) {
    return this.usersService.findById(id);
  }
}
