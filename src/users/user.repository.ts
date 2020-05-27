import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import {
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { SignInDto } from 'src/auth/dto/signin.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password, artistName } = credentialsDto;

    const user = new User();
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.role = 'inactive';
    user.artistName = artistName;
    user.isBlocked = false;
    user.avatar =
      'https://hypelearning.s3.eu-central-1.amazonaws.com/default.jpg';

    try {
      await user.save();
    } catch (error) {
      if (error.code != '23505') {
        throw new InternalServerErrorException(error);
      }
      throw new ConflictException('Email already exists');
    }

    return user;
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async validatePassword(signInDto: SignInDto): Promise<string> {
    const { email, password } = signInDto;
    const user = await this.findOne({ email });

    if (!user || !(await user.validatePassword(password))) {
      return null;
    }

    return user.email;
  }

  async getUsers(): Promise<User[]> {
    return await this.find();
  }
}
