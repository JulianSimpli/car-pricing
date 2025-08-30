import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';

import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => { return Promise.resolve({ id: 1, email: 'asd@asd.com', password: 'asd' } as User) },
      find: (email: string) => { return Promise.resolve([{ id: 1, email: 'asd@asd.com', password: 'asd' } as User]) },
      // remove: () => { },
      // update: () => { }
    }
    fakeAuthService = {
      signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
      // signup: () => { }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UserService,
          useValue: fakeUserService
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers should returns user with a given email', async () => {
    const [user] = await controller.findAllUsers('asd@asd.com')
    expect(user.id).toBe(1)
  })

  it('findUser should returns a user with a given id', async () => {
    const user = await controller.findUser('1')
    expect(user.id).toBe(1)
  })

  it('findUser should returns an excepetion if user does not exists', async () => {
    fakeUserService.findOne = (id: number) => Promise.resolve(null);
    // try {
    //   await controller.findUser('1');
    //   fail('Should throw NotFoundException');
    // } catch (e) {
    //   expect(e).toBeInstanceOf(NotFoundException);
    // }
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  })

  it('signin should update session object', async () => {
    const session = {}
    await controller.signin({ email: 'asd@asd.com', password: 'asd' }, session)
    expect(session).not.toBe({})
    expect(session).toStrictEqual({ userId: 1 })
  })
});
