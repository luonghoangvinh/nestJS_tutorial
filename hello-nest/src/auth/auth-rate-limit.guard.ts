import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

const AUTH_RATE_LIMIT_WINDOW_MS = 60_000;
const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, RateLimitEntry>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.getRateLimitKey(request);
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry || entry.resetAt <= now) {
      this.attempts.set(key, {
        count: 1,
        resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS,
      });

      return true;
    }

    if (entry.count >= AUTH_RATE_LIMIT_MAX_ATTEMPTS) {
      throw new HttpException(
        'Too many authentication attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    entry.count += 1;
    return true;
  }

  private getRateLimitKey(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim() || request.ip || 'unknown';

    return `${request.method}:${request.path}:${ip}`;
  }
}
