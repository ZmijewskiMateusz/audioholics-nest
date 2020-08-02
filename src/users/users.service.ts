import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { S3UploadsService } from '../common/s3-uploads.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    // @InjectRepository(Article)
    // private readonly coursesRepository: Repository<Article>,
    private readonly uploadFileService: S3UploadsService,
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findByEmail(userEmail: string): Promise<User> {
    return await this.userRepository.findOne({ email: userEmail });
  }

  public async findById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  public async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async update(
    user: User,
    newValue: UpdateUserDto,
    file: any,
  ): Promise<User> {
    if (!user) {
      // tslint:disable-next-line:no-console
      console.error("user doesn't exist");
      return;
    }

    // newValue.email ? (user.email = newValue.email) : (user.email = user.email);

    console.log(newValue.email);
    console.log('xD');

    if (file) {
      const fileUrl = await this.uploadFileService.uploadFile(file);
      user.avatar = process.env.AWS_URL + fileUrl;
      await this.userRepository.update(user.id, user);
    }

    if (newValue.email != '') {
      user.email = newValue.email;
      await this.userRepository.update(user.id, user);
    }

    if (newValue.password != '') {
      user.password = newValue.password;
      await this.userRepository.update(user.id, {
        password: (
          await this.userRepository.hashPassword(user.password, user.salt)
        ).toString(),
      });
    }

    // if (newValue.email || newValue.password) {
    //   user.email = newValue.email || user.email;
    //   user.password = newValue.password || user.password;

    //   newValue.password!=null
    //   ? (user.password = newValue.password)
    //   : (user.password = user.password);
    //   await this.userRepository.update(user.id, {
    //     email: user.email,
    //     password: (
    //       await this.userRepository.hashPassword(user.password, user.salt)
    //     ).toString(),
    //   });
    // }

    return await this.userRepository.findOne(user.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    await this.userRepository.delete(id);
    return new DeleteResult();
  }

  public async register(userDto: CreateUserDto): Promise<User> {
    const { email } = userDto;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = this.userRepository.create(userDto);
    user.avatar = '';
    return await this.userRepository.save(user);
  }

  async changeStatus(id: number) {
    const user = await this.userRepository.findOne(id);
    user.isBlocked = !user.isBlocked;

    return this.userRepository.save(user);
  }
}
