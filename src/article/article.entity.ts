import { PrimaryGeneratedColumn, Column, Entity, BeforeUpdate, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user.entity";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;
  
    @Column()
    @ApiProperty()
    slug: string;

    @Column()
    @ApiProperty()
    title: string;

    @Column({default: ''})
    description: string;

    @Column({default: ''})
    body: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    created: Date;
  
    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
      this.updated = new Date;
    }

    @Column()
    category: string;

    @Column()
    points: number;

    @ManyToOne(type => User, user => user.articles)
    author: User;
}