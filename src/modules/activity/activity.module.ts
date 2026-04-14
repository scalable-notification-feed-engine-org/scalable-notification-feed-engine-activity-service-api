import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { PrismaService } from '../../prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'activity-service-api',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'activity-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, PrismaService],
})
export class ActivityModule {}
