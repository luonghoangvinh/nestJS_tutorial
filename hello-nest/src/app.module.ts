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

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'vi',

      loaderOptions: {
        path: path.join(__dirname, '../i18n'),
        watch: true,
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
        url: config.get<string>('DATABASE_URL'),

        ssl: {
          rejectUnauthorized: true,
        },

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
