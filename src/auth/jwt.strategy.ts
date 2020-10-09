import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { AppConfigService } from '../config/app/config.service';
import { Connection } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private appConfigService: AppConfigService,
    private connection: Connection,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfigService.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.connection
      .getRepository(User)
      .createQueryBuilder()
      .where(email)
      .select('user')
      .addSelect('user.password', 'user.salt')
      .getOne();

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
