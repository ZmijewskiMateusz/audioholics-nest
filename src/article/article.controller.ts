import { Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/users/user.decorator';
import { ArticlesRO } from './articles.ro';

@ApiTags('Article')
@Controller('article')
export class ArticleController {

    constructor(private articleService: ArticleService){}

    @ApiOperation({ summary: 'Get all articles' })
    @ApiResponse({ status: 200, description: 'Return all articles.'})
    @Get()
    async findAll(@Query() query): Promise<ArticlesRO> {
      return await this.articleService.findAll(query);
    }
  
  
    @ApiOperation({ summary: 'Get article feed' })
    @ApiResponse({ status: 200, description: 'Return article feed.'})
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get('feed')
    async getFeed(@GetUser('id') userId: number, @Query() query): Promise<ArticlesRO> {
      return await this.articleService.findFeed(userId, query);
    }
}
