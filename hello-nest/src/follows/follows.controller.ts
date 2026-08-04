import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  follow(
    @Req() req,
    @Param('id', ParseIntPipe) followingId: number,
  ) {
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
    @Param('id', ParseIntPipe) followingId: number,
  ) {
    return this.followService.unfollowUser(
      req.user.id,
      followingId,
    );
  }
}