import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
    Unique,
    PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('follows')
@Unique(['follower', 'following'])
export class Follow {
    @PrimaryColumn({ name: 'follower_id' })
    followerId!: number;

    @PrimaryColumn({ name: 'following_id' })
    followingId!: number;
    // Người bấm Follow
    @ManyToOne(() => User, (user) => user.following, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'follower_id' })
    follower!: User;

    // Người được Follow
    @ManyToOne(() => User, (user) => user.followers, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'following_id' })
    following!: User;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt?: Date;
}