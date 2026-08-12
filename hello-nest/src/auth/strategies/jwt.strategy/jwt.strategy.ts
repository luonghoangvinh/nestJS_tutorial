import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../../auth.service';

type JwtPayload = {
    sub: number;
    email: string;
    username: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: process.env.JWT_SECRET || 'jwt-secret',
        });
    }

    async validate(request: Request, payload: JwtPayload) {
        const token = request.headers.authorization?.split(' ')[1];

        if (!token || (await this.authService.isTokenBlacklisted(token))) {
            throw new UnauthorizedException('Token is invalidated');
        }

        return this.authService.validateUser(payload.sub);
    }
}
