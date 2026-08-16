import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Hello World',
    description: 'Trả về lời chào theo ngôn ngữ được chọn(vi hoặc en).',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    example: 'vi',
    enum: ['vi', 'en'],
    description: 'Language',
  })
  getHello(@I18n() i18n: I18nContext) {
    return this.appService.getHello(i18n);
  }
}
