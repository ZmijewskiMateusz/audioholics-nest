import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../users/user.decorator';
import { User } from '../users/user.entity';
import { Circle } from './circle.entity';
import { CircleService } from './circle.service';
import { CreateCircleDto } from './dto/create-circle.dto';

@ApiTags('Circles')
@Controller('circles')
export class CircleController {
  constructor(private circleService: CircleService) {}

  @ApiOperation({ summary: 'Create a Circle' })
  @ApiResponse({
    status: 201,
    description: 'The Circle has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @GetUser() user: User,
    @Body() circleData: CreateCircleDto,
  ): Promise<Circle> {
    return this.circleService.create(user.id, circleData);
  }
}
