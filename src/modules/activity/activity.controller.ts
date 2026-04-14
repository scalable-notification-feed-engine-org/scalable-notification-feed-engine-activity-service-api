import { Body, Controller, Post } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.createActivity(createActivityDto);
  }

  @EventPattern('activity.create')
  handleActivityCreated(@Payload() data: any) {
    console.log('Kafka Message Received:', data);
  }
}
