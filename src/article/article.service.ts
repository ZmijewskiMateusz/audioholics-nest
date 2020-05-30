import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository, getRepository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ArticlesRO } from './articles.ro';
import { UserRepository } from 'src/users/user.repository';
import { FollowsEntity } from 'src/profile/follows.entity';

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
        const _follows = await this.followsRepository.find( {followerId: userId});

        if (!(Array.isArray(_follows) && _follows.length > 0)) {
          return {articles: [], articlesCount: 0};
        }
    
        const ids = _follows.map(el => el.followingId);
        const qb = await getRepository(Article).createQueryBuilder('article').where('article.authorId IN (:ids)', { ids })
    }
}
