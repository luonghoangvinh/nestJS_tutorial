import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Follow } from '../../follows/entities/follow.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  username!: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  avatar?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt?: Date;

  @OneToMany(() => Article, (article) => article.user)
  articles?: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  // Những người đang follow user này
  @OneToMany(() => Follow, (follow) => follow.following)
  followers?: Follow[];

  // Những người mà user này đang follow
  @OneToMany(() => Follow, (follow) => follow.follower)
  following?: Follow[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites?: Favorite[];
}
