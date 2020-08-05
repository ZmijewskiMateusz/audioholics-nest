import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './ormconfig';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { AppConfigModule } from './config/app/config.module';
import { DbConfigModule } from './config/database/config.module';
import { LoggerModule } from './common/logger/logger.module';
import { ProfileModule } from './profile/profile.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    LoggerModule,
    AppConfigModule,
    DbConfigModule,
    AuthModule,
    UsersModule,
    ArticleModule,
    ProfileModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
