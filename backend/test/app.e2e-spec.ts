import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/afisha', {
      exclude: ['content/(.*)'],
    });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/afisha/films', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.total).toBe(res.body.items.length);
  });
});
