import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Article } from '../article/article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @ManyToOne(
    type => User,
    user => user.comments,
  )
  author: User;

  @ManyToOne(
    type => Article,
    article => article.comments,
  )
  article: Article;
}
