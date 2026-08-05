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
import { antiCacheHeaders } from '../users/users.controller';



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