import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { FollowService } from './follows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


const CACHE_CONTROL_HEADER = 'Cache-Control';
const NO_STORE_CACHE_CONTROL = 'no-store, no-cache, must-revalidate';
const PRAGMA_HEADER = 'Pragma';
const NO_CACHE_HEADER_VALUE = 'no-cache';
const EXPIRES_HEADER = 'Expires';
const EXPIRED_HEADER_VALUE = '0';
function antiCacheHeaders(response: Response): void {
  response.setHeader(CACHE_CONTROL_HEADER, NO_STORE_CACHE_CONTROL);
  response.setHeader(PRAGMA_HEADER, NO_CACHE_HEADER_VALUE);
  response.setHeader(EXPIRES_HEADER, EXPIRED_HEADER_VALUE);
}

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) { }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  follow(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Param('id', ParseIntPipe) followingId: number,
  ) {
    antiCacheHeaders(res);
    return this.followService.followUser(
      req.user.id,
      followingId,
    );
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  unfollow(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Param('id', ParseIntPipe) followingId: number,
  ) {
    antiCacheHeaders(res);
    return this.followService.unfollowUser(
      req.user.id,
      followingId,
    );
  }
}