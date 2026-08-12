import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,

  ) {}
  create(createCommentDto: CreateCommentDto, userId: number,articleId: number) {
    return this.commentsRepository.save({
      userId,
      articleId,
      ...createCommentDto
      
    });
  }


  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.commentsRepository.update(id, updateCommentDto);
    return {
      message: `Comment with id ${id} updated successfully`,
    };
  }

  async remove(id: number) {
    await this.commentsRepository.delete(id);
    return {
      message: `Comment with id ${id} deleted successfully`,
    };
  }
}
