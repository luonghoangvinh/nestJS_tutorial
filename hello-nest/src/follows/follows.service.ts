import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async followUser(followerId: number, followingId: number) {

    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!following) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra đã follow chưa
    const existed = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (existed) {
      throw new BadRequestException('Already followed');
    }

    const follow = this.followRepository.create({
      follower: { id: followerId },
      following: { id: followingId },
    });

    await this.followRepository.save(follow);

    return {
      message: 'Follow successfully',
    };
  }

  async unfollowUser(followerId: number, followingId: number) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.remove(follow);

    return {
      message: 'Unfollow successfully',
    };
  }
}