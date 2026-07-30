import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Tutorial1Module } from './tutorial1/tutorial1.module';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'node:path';

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
    Tutorial1Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }