import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Article } from '../article/article.entity';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async create(slug: string, user: User, body: string): Promise<Comment> {
    let comment = new Comment();
    comment.body = body;
    comment.author = user;

    const savedComment = await this.commentRepository.save(comment);
    const article = await this.articleRepository.findOne({ slug: slug });
    article.comments.push(savedComment);
    await this.articleRepository.save(article);
    user.comments.push(savedComment);
    await this.userRepository.save(user);

    return savedComment;
  }
}
