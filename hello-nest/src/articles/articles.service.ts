import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../follows/entities/follow.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>
  ) { }

  create(createArticleDto: CreateArticleDto, userId: number) {
    return this.articleRepository.save({ ...createArticleDto, userId });
  }

  findAll() {
    return this.articleRepository.find();
  }

  findOne(id: number) {
    return this.articleRepository.findOne({ where: { id } });
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
    return this.articleRepository.find({
      where: { userId: In(feedArticles) },
    });
  }
}
