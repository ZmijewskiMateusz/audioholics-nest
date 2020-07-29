import { UserRO } from 'src/users/user.ro';

export class ArticleData {
  id: number;
  slug: string;
  title: string;
  description: string;
  body?: string;
  category?: string;
  created?: Date;
  updated?: Date;
  favorited?: boolean;
  points?: number;
  author?: UserRO;
  updateTimestamp?: Date;
  headerImage?: string;
}
