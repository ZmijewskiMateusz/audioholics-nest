import { Repository } from 'typeorm';
import { entities } from 'src/ormconfig';

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  }),
);

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
