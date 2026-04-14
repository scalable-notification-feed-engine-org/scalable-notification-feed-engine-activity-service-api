import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityModule } from './modules/activity/activity.module';

@Module({
  imports: [ActivityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
