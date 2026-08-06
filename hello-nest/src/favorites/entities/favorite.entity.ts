import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';

@Entity('favorites')
export class Favorite {
    @PrimaryColumn({ name: 'user_id', type: 'bigint' })
    userId!: number;

    @PrimaryColumn({ name: 'article_id', type: 'bigint' })
    articleId!: number;

    @ManyToOne(() => User, (user) => user.favorites, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Article, (article) => article.favorites, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'article_id' })
    article!: Article;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt?: Date;
}