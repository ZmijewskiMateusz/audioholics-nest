import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthMiddleware } from 'src/users/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { FollowsEntity } from './follows.entity';
import { UsersModule } from 'src/users/users.module';
import { AppConfigModule } from 'src/config/app/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, FollowsEntity]), UsersModule, AppConfigModule],
  controllers: [ProfileController],
  providers: [ProfileService,]
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware)
    .forRoutes({path: 'profiles/:username/follow', method: RequestMethod.ALL});
  }
}
