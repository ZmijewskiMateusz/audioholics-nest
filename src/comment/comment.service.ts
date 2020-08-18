import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Article } from '../article/article.entity';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddCommentDto } from './dto/add-comment.dto';
import { ArticleData } from '../article/article.data';

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

  async create(
    slug: string,
    userId: number,
    addCommentDto: AddCommentDto,
  ): Promise<Comment> {
    let comment = new Comment();
    let article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ['comments'],
      },
    );
    let author = await this.userRepository.findOne(userId, {
      relations: ['comments'],
    });

    comment.author = author;
    comment.article = article;
    comment.body = addCommentDto.body;

    const savedComment = await this.commentRepository.save(comment);
    article.comments.push(savedComment);
    article = await this.articleRepository.save(article);
    author.comments.push(savedComment);
    await this.userRepository.save(author);

    return savedComment;
  }

  async findAll(slug: string): Promise<Comment[]> {
    const article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ['comments'],
      },
    );
    return article.comments;
  }
}
