import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;

    @Column({
        name: 'user_id',
        type: 'bigint',
    })
    userId!: string;

    @Column({
        name: 'article_id',
        type: 'bigint',
    })
    articleId!: string;

    @Column({
        type: 'text',
    })
    comment!: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Article, (article) => article.comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'article_id' })
    article!: Article;
}