import { Module } from '@nestjs/common';
import { FollowService } from "../follows/follows.service";
import { FollowController } from './follows.controller';
import { User } from '../users/entities/user.entity';
import { Follow } from './entities/follow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowsModule {}
