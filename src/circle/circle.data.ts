import { UserRO } from '../users/user.ro';

export class CircleData {
  id: number;
  slug: string;
  name: string;
  description: string;
  created?: Date;
  updated?: Date;
  owner?: UserRO;
  updateTimestamp?: Date;
}
