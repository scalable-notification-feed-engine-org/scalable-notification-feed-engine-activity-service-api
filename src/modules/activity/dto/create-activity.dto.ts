import { Verb, ObjectType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  actorId: string;
  @IsEnum(Verb)
  @IsNotEmpty()
  verb: Verb;
  @IsString()
  @IsNotEmpty()
  objectId: string;
  @IsEnum(ObjectType)
  @IsNotEmpty()
  objectType: ObjectType;
  @IsObject()
  @IsOptional()
  metaData: Record<string, any>;
}
