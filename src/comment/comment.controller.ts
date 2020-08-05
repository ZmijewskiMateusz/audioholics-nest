import { Controller, Post, Param, Body } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { GetUser } from '../users/user.decorator';
import { User } from '../users/user.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':articleSlug')
  async create(
    @Param('articleSlug') slug: string,
    @GetUser() user: User,
    @Body() body: string,
  ): Promise<Comment> {
    return await this.commentService.create(slug, user, body);
  }
}
