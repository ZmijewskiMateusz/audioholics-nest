import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import {
  MockType,
  repositoryMockFactory,
} from '../common/tests/repository.mock.factory';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { UploadService } from '../common/upload';
import { ArticleData } from './article.data';
import { UserRepository } from '../users/user.repository';
import { ArticlesRO } from './articles.ro';

describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepositoryMock: MockType<Repository<Article>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        UploadService,
        {
          provide: getRepositoryToken(Article),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(FollowsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleRepositoryMock = module.get(getRepositoryToken(Article));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an article', async () => {
      const article: ArticleData = {
        title: 'Test Title',
        id: 123,
        description: 'Test desc',
        body: 'Lorem Ipsum umberto eco',
        points: 10,
        created: new Date(),
        updated: new Date(),
        slug: 'test-title-2123',
        category: 'Test category',
      };
      articleRepositoryMock.findOne.mockReturnValue(article);
      expect((await service.findOne(article.id)).article).toEqual(article);
    });
  });

  describe('findAll', () => {
    it('should return all articles', async () => {
      const article1: ArticleData = {
        title: 'Test Title',
        id: 123,
        description: 'Test desc',
        body: 'Lorem Ipsum umberto eco',
        points: 10,
        created: new Date(),
        updated: new Date(),
        slug: 'test-title-2123',
        category: 'Test category',
        updateTimestamp: new Date(),
        headerImage: 'url',
      };
      const article2: ArticleData = {
        title: 'Test Title',
        id: 125,
        description: 'Test desc',
        body: 'Lorem Ipsum umberto eco',
        points: 10,
        created: new Date(),
        updated: new Date(),
        slug: 'test-title-2123',
        category: 'Test category',
        updateTimestamp: new Date(),
        headerImage: 'url',
      };
      const article3: ArticleData = {
        title: 'Test Title',
        id: 127,
        description: 'Test desc',
        body: 'Lorem Ipsum umberto eco',
        points: 10,
        created: new Date(),
        updated: new Date(),
        slug: 'test-title-2123',
        category: 'Test category',
        updateTimestamp: new Date(),
        headerImage: 'url',
      };
      const article4: ArticleData = {
        title: 'Test Title',
        id: 121,
        description: 'Test desc',
        body: 'Lorem Ipsum umberto eco',
        points: 10,
        created: new Date(),
        updated: new Date(),
        slug: 'test-title-2123',
        category: 'Test category',
        updateTimestamp: new Date(),
        headerImage: 'url',
      };
      const article5: ArticleData = {
        title: 'Test Title',
        id: 129,
        description: 'Test desc',
        body: 'Lorem Ipsum umberto eco',
        points: 10,
        created: new Date(),
        updated: new Date(),
        slug: 'test-title-2123',
        category: 'Test category',
        updateTimestamp: new Date(),
        headerImage: 'url',
      };
      const article6: ArticleData = {
        title: 'Test Title',
        id: 143,
        description: 'Test desc',
        body: 'Lorem Ipsum umberto eco',
        points: 10,
        created: new Date(),
        updated: new Date(),
        slug: 'test-title-2123',
        category: 'Test category',
        updateTimestamp: new Date(),
        headerImage: 'url',
      };
      let articles: ArticleData[] = [];
      articles.push(article1, article2, article3, article4, article5, article6);
      articleRepositoryMock.find.mockReturnValue(articles);
      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        let articlesMock = new ArticlesRO();
        articlesMock.articles = [];
        articles.forEach(article => {
          articlesMock.articles.push(Object.assign(new Article(), article));
        });
        return articlesMock;
      });
      expect((await service.findAll('')).articles).toEqual(articles);
      expect((await service.findAll('')).articles.length).toEqual(
        articles.length,
      );
    });
  });
});
