import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Circle {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  slug: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ default: '' })
  description: string;

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
    user => user.circlesOwned,
  )
  owner: User;

  @ManyToMany(
    type => User,
    user => user.circles,
  )
  members: User[];
}
