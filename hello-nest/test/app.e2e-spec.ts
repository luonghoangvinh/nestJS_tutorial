import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';

import { createE2eTestApp, resetTestSchema } from './e2e-test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication<App> | undefined;
  let dataSource: DataSource | undefined;

  beforeAll(async () => {
    const initializedApp = await createE2eTestApp();
    const initializedDataSource = initializedApp.get(DataSource);

    app = initializedApp;
    dataSource = initializedDataSource;

    await resetTestSchema(initializedDataSource);
  });

  it('/ (GET)', () => {
    expect(app).toBeDefined();

    return request(app!.getHttpServer())
      .get('/?lang=en')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app?.close();
  });
});
