import { UserRO } from "src/users/user.ro";

export class ArticleData {
    slug: string;
    title: string;
    description: string;
    body?: string;
    category?: string;
    createdAt?: Date
    updatedAt?: Date
    favorited?: boolean;
    points?: number;
    author?: UserRO;
}