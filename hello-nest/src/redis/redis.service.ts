import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

const REDIS_DEFAULT_PORT = 6379;

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: REDIS_DEFAULT_PORT,
    });
  }

  getClient() {
    return this.redis;
  }
}
