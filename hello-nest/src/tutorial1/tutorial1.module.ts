import { Module } from '@nestjs/common';
import { Tutorial1Service } from './tutorial1.service';
import { Tutorial1Controller } from './tutorial1.controller';

@Module({
  controllers: [Tutorial1Controller],
  providers: [Tutorial1Service],
})
export class Tutorial1Module {}
