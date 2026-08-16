import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { antiCacheHeaders } from '../users/users.controller';
import type { Response } from 'express';
import { ArticleQueryDto } from './dto/article-query.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto,
  @Req() req,
  @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);
    return this.articlesService.create(createArticleDto, req.user.id);
    
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query() query: ArticleQueryDto,
    @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);
    return this.articlesService.findAll(query);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);
    return this.articlesService.findOne(+id);
  }
  
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('comments/:id')
  getCommentsByArticleId(@Param('id') id: number, @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);
    return this.articlesService.getCommentsByArticleId(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('feedArticles/me')
  feedArticles(@Req() req, @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);
    return this.articlesService.feedArticles(req.user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);
    return this.articlesService.update(+id, updateArticleDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);
    return this.articlesService.remove(+id);
  }
}
