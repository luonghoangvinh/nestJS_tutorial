import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';
import { antiCacheHeaders } from '../users/users.controller';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(":id")
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('id') articleId: number,
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    antiCacheHeaders(res);
    return this.commentsService.create(createCommentDto, req.user.id, articleId);
  }

  
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Res({ passthrough: true }) res: Response
  ) {
    antiCacheHeaders(res);
    return this.commentsService.update(id, updateCommentDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number,
    @Res({ passthrough: true }) res: Response) {
    antiCacheHeaders(res);
    return await this.commentsService.remove(id);
  }
}
