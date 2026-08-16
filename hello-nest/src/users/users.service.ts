import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users: User[] = await this.usersRepository.find();
    return users.map((user) => new UserResponseDto(user));
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    return user?? null;
  }

  async findByUsername(username: string): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    return user ? new UserResponseDto(user) : null;
  }

  async create(userData: Partial<User>): Promise<User> {
    const existedEmail = await this.findByEmail(userData.email!);

    if (existedEmail) {
      throw new ConflictException('Email already exists');
    }

    const existedUsername = await this.findByUsername(userData.username!);

    if (existedUsername) {
      throw new ConflictException('Username already exists');
    }

    const user = this.usersRepository.create(userData);

    return this.usersRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, userData);

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.remove(user);
  }

  async getProfile(userId: number){
    const user = await this.usersRepository.findOne({
  where: { id: userId },
  relations: {
    articles: true,
    comments: true,
    followers: true,
    following: true,
  },
  select:{
    articles:{
      id:true,
      title:true,
      content:true,
      createdAt:true,
      updatedAt:true,
    },
    comments:{
      id:true,
      articleId:true,
      comment:true,
    },
    followers:{
      followerId:true,
      followingId:false,
    },
    following:{
      followerId:false,
      followingId:true,
    }
  }
});

    return  user;
  }

  async updateAvatar(
    userId: number,
    file: any,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Đường dẫn lưu trong database
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    user.avatar = avatarUrl;

    await this.usersRepository.save(user);

    return {
      message: 'Update avatar successfully',
      avatar: avatarUrl,
    };
  }
}
