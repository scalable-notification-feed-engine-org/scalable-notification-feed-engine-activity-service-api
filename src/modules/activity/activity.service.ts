import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ClientKafka } from '@nestjs/microservices';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from '@prisma/client';

@Injectable()
export class ActivityService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async createActivity(dto: CreateActivityDto): Promise<Activity> {
    const activity = await this.prisma.activity.create({
      data: {
        actorId: dto.actorId,
        verb: dto.verb,
        objectId: dto.objectId,
        objectType: dto.objectType,
        metaData: dto.metaData,
        tenantId: 'tenant-001',
      },
    });
    this.kafkaClient.emit('activity.create', {
      key: activity.actorId,
      value: activity,
    });
    return activity;
  }
}
