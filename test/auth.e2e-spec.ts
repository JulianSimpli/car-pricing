import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('handles a signup request', () => {
    const email = 'asdd@asd.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asd' })
      .expect(201)
      .then((res) => {
        const { id, email: responseEmail } = res.body
        expect(id).toBeDefined()
        expect(responseEmail).toBe(email)
      })
  });

  it('singup a new user then get the currently logged in user', async () => {
    const email = 'test@test.com'

    const agent = request.agent(app.getHttpServer())

    await agent
      .post('/auth/signup')
      .send({ email, password: 'asd' })
      .expect(201)

    const { body } = await agent
      .get('/auth/whoami')
      .expect(200)

    expect(body.email).toBe(email)
  })
});
