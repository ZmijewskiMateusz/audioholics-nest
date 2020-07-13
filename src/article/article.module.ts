import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { Article } from './article.entity';
import { FollowsEntity } from 'src/profile/follows.entity';
import { UsersModule } from 'src/users/users.module';
import { UploadService } from '../common/upload';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, FollowsEntity, Article]),
    UsersModule,
    UploadService,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, UploadService],
})
export class ArticleModule {}
