import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { UserData } from '../users/user.data';
import { UserRO } from '../users/user.ro';
import { User } from '../users/user.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<UserData> {
    const user = await this.userRepository.findOne({ email: email });
    return Object.assign(new UserData(), user);
  }
}
