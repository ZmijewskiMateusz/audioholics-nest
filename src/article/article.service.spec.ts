import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "./article.service";
import { MockType, repositoryMockFactory } from "../common/tests/repository.mock.factory";
import { Article } from "./article.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { FollowsEntity } from "../profile/follows.entity";
import { UploadService } from "../common/upload";
import { ArticleData } from "./article.data";


describe('ArticleService', () => {
    let service: ArticleService;
    let articleRepositoryMock: MockType<Repository<Article>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ArticleService, UploadService,
                 { provide: getRepositoryToken(Article), useFactory: repositoryMockFactory },
                 { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
                 { provide: getRepositoryToken(FollowsEntity), useFactory: repositoryMockFactory },]
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
})