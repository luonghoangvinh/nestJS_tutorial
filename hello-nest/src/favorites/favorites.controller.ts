import { Controller, Post, Param, Delete, Req, UseGuards, Res } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { antiCacheHeaders } from '../users/users.controller';
import type { Response } from 'express';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  favoriteArticle(@Param('id') id: number, @Req() req, @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);

    return this.favoritesService.favoriteArticle(req.user.id, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('unfavorite/:id')
  unfavoriteArticle(@Param('id') id: number, @Req() req, @Res({passthrough: true}) res:Response) {
    antiCacheHeaders(res);
    return this.favoritesService.unfavoriteArticle(req.user.id, id);
  }
}
