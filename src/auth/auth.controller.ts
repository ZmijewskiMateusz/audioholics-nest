import {
  Controller,
  Body,
  ValidationPipe,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { User } from '../users/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { UserVM } from './dto/user.vm';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  @UseInterceptors(ClassSerializerInterceptor)
  signUp(@Body(ValidationPipe) credentialsDto: CredentialsDto): Promise<User> {
    return this.authService.signUp(credentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
  ): Promise<UserVM> {
    return this.authService.signIn(signInDto);
  }

  @Post('/checkemail')
  checkIfEmailExists(@Body() email: string): Promise<boolean> {
    return this.authService.checkIfEmailExists(email);
  }

  @Post('/checkartistname')
  checkIfArtistNameExists(@Body() artistName: string): Promise<boolean> {
    return this.authService.checkIfEmailExists(artistName);
  }
}
