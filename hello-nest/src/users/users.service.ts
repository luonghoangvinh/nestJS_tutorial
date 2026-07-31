import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}


  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }


  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }


  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
    });
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


  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findById(id);

    Object.assign(user, userData);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);

    await this.usersRepository.remove(user);
  }
}