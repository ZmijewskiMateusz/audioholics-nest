import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/user.repository';
import { CircleData } from './circle.data';
import { Circle } from './circle.entity';
import { CreateCircleDto } from './dto/create-circle.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const slug = require('slug');

@Injectable()
export class CircleService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    @InjectRepository(Circle)
    private circleRepository: Repository<Circle>,
  ) {}

  async create(userId: number, circleData: CreateCircleDto): Promise<Circle> {
    let circle = new Circle();
    circle.name = circleData.name;
    circle.description = circleData.description;
    circle.slug = this.slugify(circleData.name);
    circle = await this.circleRepository.save(circle);

    const owner = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['circles'],
    });
    owner.circlesOwned.push(circle);

    await this.userRepository.save(owner);
    const response = Object.assign(new CircleData(), circle);
    return response;
  }

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
