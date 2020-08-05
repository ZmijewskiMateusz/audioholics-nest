import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { Article } from '../article/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Article]), UsersModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
