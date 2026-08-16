import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../follows/entities/follow.entity';
import { ArticleResponseDto } from './dto/article-response.dto';
import { ArticleQueryDto } from './dto/article-query.dto';

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
    return { message: 'Article created successfully', article: new ArticleResponseDto(article) };
  }

  async findAll(query: ArticleQueryDto) {
    const {
      search,
      userId,
      page = 1,
      limit = 10,
    } = query;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article');

    // Search
    if (search) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.content ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // Filter
    if (userId) {
      queryBuilder.andWhere(
        'article.userId = :userId',
        { userId },
      );
    }

    // Phân trang
    const skip = (page - 1) * limit;

    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('article.createdAt', 'DESC');

    const [articles, total] =
      await queryBuilder.getManyAndCount();

    return {
      data: articles.map(
        article => new ArticleResponseDto(article),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    return { message: 'Article removed successfully', article: this.articleRepository.delete(id) };
  }

  async feedArticles(userId: number) {
    const followedUsers = await this.followRepository.find({ where: { followerId: userId } });

    const feedArticles = followedUsers.map(follow => follow.followingId);
    const articles = await this.articleRepository.find({
      where: { userId: In(feedArticles) },
    });
    return articles.map(article => new ArticleResponseDto(article));
  }
getCommentsByArticleId(articleId: number) {
  return this.articleRepository.findOne({
    where: { id: articleId },
    relations: { comments: true },
    select: {
      id: true,
      title: true,
      comments: {
        id: true,
        userId: true,
        comment: true,
        createdAt: true,
      },
    },
  });
}
}
