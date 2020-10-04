import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { CircleController } from './circle.controller';
import { Circle } from './circle.entity';
import { CircleService } from './circle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Circle]), UsersModule],
  controllers: [CircleController],
  providers: [CircleService],
})
export class CircleModule {}
