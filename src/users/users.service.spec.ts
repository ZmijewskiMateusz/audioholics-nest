import { Test, TestingModule } from '@nestjs/testing';
import {
  MockType,
  repositoryMockFactory,
} from '../common/tests/repository.mock.factory';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserData } from './user.data';
import { S3UploadsService } from '../common/upload-file';

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: MockType<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        S3UploadsService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(UserRepository); //instead of getRepositoryToken
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user', async () => {
      const user: UserData = {
        email: 'test@gmail.com',
        artistName: 'Tester',
        token: '23981e9fhf1h9f73hf743hfhrffh47',
      };
      repositoryMock.findOne.mockReturnValue(user);
      expect(await service.findByEmail(user.email)).toEqual(user);
    });
  });
});
