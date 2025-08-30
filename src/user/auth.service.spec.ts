import { Test } from "@nestjs/testing"

import { AuthService } from "./auth.service"
import { UserService } from "./user.service"
import { User } from "./user.entity"
import { BadRequestException, NotFoundException } from "@nestjs/common"

describe('AuthService', () => {
  let authService: AuthService
  let fakeUserService: Partial<UserService>

  beforeEach(async () => {
    const users: User[] = []
    // Create a fake user service for auth service dependencies
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User
        users.push(user)
        return Promise.resolve(user)
      }
    }

    // example of kae user service use
    // this returns an empty array
    // const arr = await fakeUserService.find()

    // Creo mi modulo de dependencias de test
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // if anyone asks for a copy of userService
        // then give them the value fakeUserService
        {
          provide: UserService,
          useValue: fakeUserService
        }
      ]
    }).compile()

    // Get a copy of my authentication service
    authService = module.get(AuthService);
  })

  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined()
  })

  it('creates a new user with hashed password', async () => {
    const user = await authService.signup('asd@asd.com', 'asd')
    expect(user.password).not.toBe('asdf')

    const [salt, hash] = user.password.split('.')
    expect(hash).toBeDefined()
    expect(salt).toBeDefined()
  })

  it('throw an error if user signup with existing email', async () => {
    await authService.signup('asdf@asdf.com', 'asdf')
    await expect(authService.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  })

  it('throw an error if user not exists', async () => {
    await expect(authService.signin('asd@asd.com', 'password')).rejects.toThrow(NotFoundException)
  })

  it('throws if an invalid password is provided', async () => {
    await authService.signup('asdf@asdf.com', 'asdf')
    await expect(authService.signin('asdf@asdf.com', 'password2')).rejects.toThrow(NotFoundException)
  })

  it('retrieve a logged user if exists', async () => {
    await authService.signup('asd@asd.com', 'password');
    const [user] = await fakeUserService.find('asd@asd.com')
    expect(user).toBeDefined()
    expect(await authService.signin('asd@asd.com', 'password')).toBe(user)
  })
})