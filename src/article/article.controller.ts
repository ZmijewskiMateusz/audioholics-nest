import { Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/users/user.decorator';
import { ArticlesRO } from './articles.ro';
import { ArticleRO } from './article.ro';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from 'src/users/user.entity';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {

  constructor(private articleService: ArticleService) { }

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }


  @ApiOperation({ summary: 'Get article feed' })
  @ApiResponse({ status: 200, description: 'Return article feed.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed')
  async getFeed(@GetUser() userId: number, @Query() query): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne({ slug });
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@GetUser() user: User, @Body() articleData: CreateArticleDto) {
    return this.articleService.create(user.id, articleData);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@Param() params, @Body('article') articleData: CreateArticleDto) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }
}
