import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { Article } from './article.entity';
import { FollowsEntity } from 'src/profile/follows.entity';
import { UsersModule } from '../users/users.module';
import { UploadService } from '../common/upload';
import { S3UploadsService } from '../common/s3-uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, FollowsEntity, Article]),
    UsersModule,
    S3UploadsService,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, S3UploadsService],
})
export class ArticleModule {}
