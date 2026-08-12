import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource, Repository } from 'typeorm';

import { Article } from '../src/articles/entities/article.entity';
import { Follow } from '../src/follows/entities/follow.entity';
import { User } from '../src/users/entities/user.entity';
import {
  createE2eTestApp,
  resetTestSchema,
  truncateTestTables,
} from './e2e-test-utils';

type SeededUser = {
  id: number;
  email: string;
  password: string;
  username: string;
};

describe('ArticlesController (e2e)', () => {
  let app: INestApplication<App> | undefined;
  let dataSource: DataSource | undefined;
  let usersRepository: Repository<User> | undefined;
  let articlesRepository: Repository<Article> | undefined;
  let followsRepository: Repository<Follow> | undefined;

  beforeAll(async () => {
    const initializedApp = await createE2eTestApp();
    const initializedDataSource = initializedApp.get(DataSource);

    app = initializedApp;
    dataSource = initializedDataSource;
    usersRepository = initializedDataSource.getRepository(User);
    articlesRepository = initializedDataSource.getRepository(Article);
    followsRepository = initializedDataSource.getRepository(Follow);

    await resetTestSchema(initializedDataSource);
  });

  beforeEach(async () => {
    if (dataSource) {
      await truncateTestTables(dataSource);
    }
  });

  afterEach(async () => {
    if (dataSource) {
      await truncateTestTables(dataSource);
    }
  });

  afterAll(async () => {
    await app?.close();
  });

  async function seedUser(username: string): Promise<SeededUser> {
    const password = `${username}_password`;
    const user = await usersRepository!.save({
      username,
      email: `${username}@example.com`,
      password: await bcrypt.hash(password, 10),
    });

    return {
      id: Number(user.id),
      email: user.email,
      password,
      username: user.username,
    };
  }

  async function login(user: SeededUser): Promise<string> {
    expect(app).toBeDefined();

    const response = await request(app!.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201);

    expect(response.body.access_token).toEqual(expect.any(String));

    return response.body.access_token as string;
  }

  it('creates an article for the authenticated user and persists it', async () => {
    const author = await seedUser('article_author');
    const accessToken = await login(author);

    expect(app).toBeDefined();

    const response = await request(app!.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'E2E article title',
        description: 'Created through the HTTP controller',
        content: 'This content should be stored in the test database.',
      })
      .expect(201);

    expect(response.headers['cache-control']).toBe(
      'no-store, no-cache, must-revalidate',
    );
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userId: author.id.toString(),
        title: 'E2E article title',
        description: 'Created through the HTTP controller',
        content: 'This content should be stored in the test database.',
      }),
    );

    const articleInDatabase = await articlesRepository!.findOneByOrFail({
      id: Number(response.body.id),
    });

    expect(Number(articleInDatabase.userId)).toBe(author.id);
    expect(articleInDatabase.title).toBe('E2E article title');
  });

  it('returns only articles from followed users in the authenticated feed', async () => {
    const viewer = await seedUser('feed_viewer');
    const followedAuthor = await seedUser('followed_author');
    const otherAuthor = await seedUser('other_author');

    await followsRepository!.save({
      followerId: viewer.id,
      followingId: followedAuthor.id,
    });
    await articlesRepository!.save([
      {
        userId: followedAuthor.id,
        title: 'Visible followed article',
        content: 'The viewer follows this author.',
      },
      {
        userId: otherAuthor.id,
        title: 'Hidden unfollowed article',
        content: 'The viewer does not follow this author.',
      },
      {
        userId: viewer.id,
        title: 'Hidden own article',
        content: 'The feed endpoint only loads followed users.',
      },
    ]);

    const accessToken = await login(viewer);

    expect(app).toBeDefined();

    const response = await request(app!.getHttpServer())
      .get('/articles/feedArticles/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        userId: followedAuthor.id.toString(),
        title: 'Visible followed article',
      }),
    );
  });

  it('requires authentication before reading articles', async () => {
    expect(app).toBeDefined();

    await request(app!.getHttpServer()).get('/articles').expect(401);
  });
});
