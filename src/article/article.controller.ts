import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Param,
  Body,
  Post,
  Put,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesRO } from './articles.ro';
import { ArticleRO } from './article.ro';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetUser } from '../users/user.decorator';
import { User } from '../users/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../common/storage';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @ApiOperation({ summary: 'Get article feed' })
  @ApiResponse({ status: 200, description: 'Return article feed.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('feed')
  async getFeed(
    @GetUser() userId: number,
    @Query() query,
  ): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @Get(':slug')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne({ slug });
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('headerImage'))
  @Post()
  async create(
    @GetUser() user: User,
    @Body() articleData: CreateArticleDto,
    @UploadedFile() headerImage: any,
  ) {
    return this.articleService.create(user.id, articleData, headerImage);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(
    @Param() params,
    @Body('article') articleData: CreateArticleDto,
  ) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Clap' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully applauded.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug')
  async clap(@Param() params) {
    return this.articleService.clap(params.slug);
  }
}
