import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityModule } from './modules/activity/activity.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ActivityModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
