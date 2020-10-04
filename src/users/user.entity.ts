/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Article } from '../article/article.entity';
import { Comment } from '../comment/comment.entity';
import { Exclude } from 'class-transformer';
import { Circle } from '../circle/circle.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  @Column()
  @ApiProperty()
  role: string;

  @Column()
  @ApiProperty()
  artistName: string;

  @Column()
  isBlocked: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  avatar: string;

  @OneToMany(
    type => Article,
    article => article.author,
  )
  articles: Article[];

  @OneToMany(
    type => Comment,
    comment => comment.author,
  )
  comments: Comment[];

  @OneToMany(
    type => Circle,
    circle => circle.owner,
  )
  circlesOwned: Circle[];

  @ManyToMany(
    type => Circle,
    circle => circle.members,
  )
  circles: Circle[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
