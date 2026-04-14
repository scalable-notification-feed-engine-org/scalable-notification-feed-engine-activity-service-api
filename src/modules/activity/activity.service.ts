import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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

  async createActivity(
    dto: CreateActivityDto,
    tenantId: string,
  ): Promise<Activity> {
    const activity = await this.prisma.activity.create({
      data: {
        actorId: dto.actorId,
        verb: dto.verb,
        objectId: dto.objectId,
        objectType: dto.objectType,
        metaData: dto.metaData,
        tenantId: tenantId,
      },
    });

    try {
      this.kafkaClient.emit('activity.created', {
        key: tenantId,
        value: activity,
      });
    } catch (error) {
      console.log(error);
    }

    return activity;
  }

  async findAll(tenantId: string, page: number = 1, size: number = 10) {
    const skip = (page - 1) * size;

    const [data, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: size,
      }),
      this.prisma.activity.count({ where: { tenantId } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / size),
      },
    };
  }
}
