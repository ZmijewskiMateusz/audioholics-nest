import {
  Controller,
  UseGuards,
  SetMetadata,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Put,
  UploadedFile,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetUser } from './user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}



  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Get('management')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['admin', 'instructor', 'student'])
  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: any,
  ): Promise<User> {
    return this.usersService.update(user, updateUserDto, file);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Put('management/changeStatus/:id')
  changeStatus(@Param('id') id: number): Promise<User> {
    return this.usersService.changeStatus(id);
  }
}
