import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ActivityService } from './activity.service';
import type { Request } from 'express';
import { CreateActivityDto } from './dto/create-activity.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(@Body() dto: CreateActivityDto, @Req() req: Request) {
    const tenantId = req.tenantId;

    return this.activityService.createActivity(dto, tenantId);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
  ) {
    const tenantId = req.tenantId;
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const sizeNumber = Math.max(1, parseInt(size, 10) || 1);

    return this.activityService.findAll(tenantId, pageNumber, sizeNumber);
  }

  @EventPattern('activity.created')
  handleActivityCreated(@Payload() data: any) {
    console.log('Kafka Message Received:', data);
  }
}
