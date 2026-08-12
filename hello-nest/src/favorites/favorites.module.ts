import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Article } from '../articles/entities/article.entity';
import { Favorite } from './entities/favorite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Article])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
