import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ArticlesRO } from './articles.ro';
import { ArticleRO } from './article.ro';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../users/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { UserRepository } from '../users/user.repository';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const slug = require('slug');


@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
        @InjectRepository(User)
        private readonly userRepository: UserRepository,
        @InjectRepository(FollowsEntity)
        private readonly followsRepository: Repository<FollowsEntity>
    ) { }

    async findAll(query): Promise<ArticlesRO> {
        const qb = await getRepository(Article).createQueryBuilder('article')
            .leftJoinAndSelect('article.author', 'author');

        qb.where("1 = 1");

        if ('author' in query) {
            const author = await this.userRepository.findOne({ artistName: query.author });
            qb.andWhere("article.authorId = :id", { id: author.id });
        }

        qb.orderBy('article.created', 'DESC');

        const articlesCount = await qb.getCount();

        if ('limit' in query) {
            qb.limit(query.limit);
        }

        if ('offset' in query) {
            qb.offset(query.offset);
        }

        const articles = await qb.getMany();

        return { articles, articlesCount };
    }

    async findFeed(userId: number, query): Promise<ArticlesRO> {
        const _follows = await this.followsRepository.find({ followerId: userId });

        if (!(Array.isArray(_follows) && _follows.length > 0)) {
            return { articles: [], articlesCount: 0 };
        }

        const ids = _follows.map(el => el.followingId);
        const qb = await getRepository(Article).createQueryBuilder('article').where('article.authorId IN (:ids)', { ids })

        qb.orderBy('article.created', 'DESC');

        const articlesCount = await qb.getCount();

        if ('limit' in query) {
            qb.limit(query.limit);
        }

        if ('offset' in query) {
            qb.offset(query.offset);
        }

        const articles = await qb.getMany();

        return { articles, articlesCount };
    }

    async findOne(where): Promise<ArticleRO> {
        const article = await this.articleRepository.findOne(where, {relations: ['author']
        });
        return { article };
    }

    async create(userId: number, articleData: CreateArticleDto): Promise<Article> {

        const article = new Article();
        article.title = articleData.title;
        article.description = articleData.description;
        article.body = articleData.body;
        article.category = articleData.category;
        article.slug = this.slugify(articleData.title);
        article.points = 0;


        const newArticle = await this.articleRepository.save(article);

        const author = await this.userRepository.findOne({ where: { id: userId }, relations: ['articles'] });
        author.articles.push(article);

        await this.userRepository.save(author);

        return newArticle;

    }

    async update(slug: string, articleData: any): Promise<ArticleRO> {
        const toUpdate = await this.articleRepository.findOne({ slug: slug });
        const updated = Object.assign(toUpdate, articleData);
        const article = await this.articleRepository.save(updated);
        return { article };
    }

    async delete(slug: string): Promise<DeleteResult> {
        return await this.articleRepository.delete({ slug: slug });
    }

    async clap(slug: string): Promise<ArticleRO> {
        const toClap = await this.articleRepository.findOne({ slug: slug });
        toClap.points++;
        const article = await this.articleRepository.save(toClap);
        return { article };
    }

    slugify(title: string) {
        return slug(title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
    }
}
