import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { CredentialsDto } from './dto/credentials.dto';
import { User } from '../users/user.entity';
import { JwtPayload } from './dto/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { UserVM } from './dto/user.vm';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private logger: AppLogger
  ) {
    this.logger.setContext('AuthService');
  }

  async signUp(credentialsDto: CredentialsDto): Promise<User> {
    return await this.userRepository.signUp(credentialsDto);
  }

  async signIn(signInDto: SignInDto): Promise<UserVM> {
    const email = await this.userRepository.validatePassword(signInDto);

    if (!email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user.isBlocked) {
      this.logger.log('An unauthorized user tried to sign in');
      throw new UnauthorizedException('Your account has been blocked');
    }

    const payload: JwtPayload = { email };
    const accessToken = this.jwtService.sign(payload);
    const response = new UserVM();
    response.email = user.email;
    response.id = user.id;
    response.artistName = user.artistName;
    response.role = user.role;
    response.isBlocked = user.isBlocked;
    response.token = accessToken;
    response.fileUrl = user.avatar;
    return response;
  }

  async checkIfEmailExists(email: string): Promise<boolean> {
    return await this.userRepository.findOne({ email: email }) ? true : false;
  }

  async checkIfArtistNameExists(artistName: string): Promise<boolean> {
    return await this.userRepository.findOne({ artistName: artistName }) ? true : false;
  }
}
