import 'dotenv/config';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';

import { RedisService } from '../src/redis/redis.service';

const TEST_TABLES = ['favorites', 'comments', 'follows', 'articles', 'users'];
const E2E_DATABASE_URL_APPLIED = 'E2E_DATABASE_URL_APPLIED';

export function useTestDatabaseUrl(): void {
  const testDatabaseUrl = process.env.DATABASE_TEST_URL;

  process.env.NODE_ENV = 'test';
  process.env.DATABASE_RETRY_ATTEMPTS = '0';

  if (!testDatabaseUrl) {
    throw new Error('DATABASE_TEST_URL is required for e2e tests');
  }

  if (
    process.env[E2E_DATABASE_URL_APPLIED] === 'true' &&
    process.env.DATABASE_URL === testDatabaseUrl
  ) {
    return;
  }

  if (testDatabaseUrl === process.env.DATABASE_URL) {
    throw new Error('DATABASE_TEST_URL must be different from DATABASE_URL');
  }

  process.env.DATABASE_URL = testDatabaseUrl;
  process.env[E2E_DATABASE_URL_APPLIED] = 'true';
}

export async function createE2eTestApp(): Promise<INestApplication<App>> {
  useTestDatabaseUrl();

  const { AppModule } =
    require('../src/app.module') as typeof import('../src/app.module');

  const redisClientMock = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
  };

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(RedisService)
    .useValue({
      getClient: () => redisClientMock,
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}

export async function resetTestSchema(dataSource: DataSource): Promise<void> {
  await dataSource.synchronize(true);
}

export async function truncateTestTables(
  dataSource: DataSource,
): Promise<void> {
  const rows = await dataSource.query<{ table_name: string }[]>(
    `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY($1::text[])
    `,
    [TEST_TABLES],
  );
  const existingTables = TEST_TABLES.filter((table) =>
    rows.some((row) => row.table_name === table),
  );

  if (existingTables.length === 0) {
    return;
  }

  await dataSource.query(
    `TRUNCATE TABLE ${existingTables.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE`,
  );
}
