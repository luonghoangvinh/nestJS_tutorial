import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Tutorial1Module } from './tutorial1/tutorial1.module';


@Module({
  imports: [Tutorial1Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
