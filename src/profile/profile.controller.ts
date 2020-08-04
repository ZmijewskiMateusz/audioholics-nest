import {
  Controller,
  UseGuards,
  SetMetadata,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProfileService } from './profile.service';
import { UserRO } from '../users/user.ro';
import { UserData } from '../users/user.data';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':email')
  async findByEmail(@Param('email') email: string): Promise<UserData> {
    return await this.profileService.findByEmail(email);
  }
}
