/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  OneToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../article/article.entity';


@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  email: string;

  @Column({select: false})
  @Exclude()
  password: string;

  @Column({select: false})
  @Exclude()
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

  @OneToMany(type => Article, article => article.author)
  articles: Article[];


  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
