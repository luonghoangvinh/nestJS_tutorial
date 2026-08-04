import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({
    name: 'user_id',
    type: 'bigint',
  })
  userId!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'text',
  })
  content!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments?: Comment[];
}
