import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,

  ) {}
  async create(createCommentDto: CreateCommentDto, userId: number,articleId: number) {
    const comment = await this.commentsRepository.save({
      userId,
      articleId,
      ...createCommentDto
      
    });
    return {
      message: 'Comment created successfully',
      comment: new CommentResponseDto(comment),
    };
  }


  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment||comment.articleId === undefined) {
      throw new Error(`Comment with id ${id} not found`);
    }
    if (comment.userId !== userId) {
      throw new Error(`You are not the owner of comment with id ${id}`);
    }
    await this.commentsRepository.update(id, updateCommentDto);
    return {
      message: `Comment with id ${id} updated successfully`,
    };
  }

  async remove(id: number, userId: number) {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment|| comment.articleId === undefined) {
      throw new Error(`Comment with id ${id} not found`);
    }
    if (comment.userId !== userId) {
      throw new Error(`You are not the owner of comment with id ${id}`);
    }
    await this.commentsRepository.delete(id);
    return {
      message: `Comment with id ${id} deleted successfully`,
    };
  }
}
