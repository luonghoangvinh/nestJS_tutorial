import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../follows/entities/follow.entity';
import { ArticleResponseDto } from './dto/article-response.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>
  ) { }

  async create(createArticleDto: CreateArticleDto, userId: number) {
    const article = await this.articleRepository.save({ ...createArticleDto, userId });
    return new ArticleResponseDto(article);
  }

  findAll() {
    return this.articleRepository.find();
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new Error('Article not found');
    }
    return new ArticleResponseDto(article);
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.articleRepository.update(id, updateArticleDto);
  }

  remove(id: number) {
    return this.articleRepository.delete(id);
  }

  async feedArticles(userId: number) {
    const followedUsers = await this.followRepository.find({ where: { followerId: userId } });

    const feedArticles = followedUsers.map(follow => follow.followingId);
    const articles = await this.articleRepository.find({
      where: { userId: In(feedArticles) },
    });
    return articles.map(article => new ArticleResponseDto(article));
  }
}
