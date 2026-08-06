import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Article } from '../articles/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async favoriteArticle(userId: number, articleId: number) {
  
  
      const favoriteArticle = await this.articleRepository.findOne({
        where: { id: articleId },
      });
  
      if (!favoriteArticle) {
        throw new NotFoundException('Article not found');
      }
  
      // Kiểm tra đã favorite chưa
      const existed = await this.favoriteRepository.findOne({
        where: {
          userId:  userId ,
          articleId: articleId,
        },
      });
  
      if (existed) {
        throw new BadRequestException('Already favorited');
      }
  
      const favorite = this.favoriteRepository.create({
        userId: userId,
        articleId: articleId,
      });
  
      await this.favoriteRepository.save(favorite);
  
      return {
        message: 'Favorite added successfully',
      };
    }
  
    async unfavoriteArticle(userId: number, articleId: number) {
      const favoritedArticle = await this.favoriteRepository.findOne({
        where: {
          userId: userId,
          articleId: articleId,
        },
      });
  
      if (!favoritedArticle) {
        throw new NotFoundException('Favorite relationship not found');
      }
  
      await this.favoriteRepository.remove(favoritedArticle);
  
      return {
        message: 'Unfavorited successfully',
      };
    }
}
