import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { FollowsModule } from './follows/follows.module';
import { FavoritesModule } from './favorites/favorites.module';

function useDatabaseSsl(
  config: ConfigService,
): false | { rejectUnauthorized: true } {
  const databaseSsl = config.get<string>('DATABASE_SSL')?.toLowerCase();
  const databaseUrl = config.get<string>('DATABASE_URL') ?? '';
  const sslMode="sslmode=require";

  if (databaseSsl) {
    return ['1', 'true', 'require'].includes(databaseSsl)
      ? { rejectUnauthorized: true }
      : false;
  }
  return databaseUrl.includes(sslMode)
    ? { rejectUnauthorized: true }
    : false;
}

function getDatabaseUrl(config: ConfigService): string | undefined {
  const databaseUrl = config.get<string>('DATABASE_URL');

  if (!databaseUrl) {
    return databaseUrl;
  }

  try {
    const parsedUrl = new URL(databaseUrl);
    parsedUrl.searchParams.delete('sslmode');

    return parsedUrl.toString();
  } catch {
    return databaseUrl;
  }
}

function getDatabaseRetryAttempts(config: ConfigService): number {
  const retryAttempts = Number(config.get<string>('DATABASE_RETRY_ATTEMPTS'));

  return Number.isFinite(retryAttempts) ? retryAttempts : 10;
}

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'vi',

      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: process.env.NODE_ENV !== 'test',
      },

      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: getDatabaseUrl(config),

        ssl: useDatabaseSsl(config),
        retryAttempts: getDatabaseRetryAttempts(config),

        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    ArticlesModule,
    CommentsModule,
    FollowsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
