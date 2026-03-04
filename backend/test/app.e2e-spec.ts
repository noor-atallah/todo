import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
let app: INestApplication;
let token: string;
let token2: string; // second user
let todoId: number;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  // Register user 1
  const res1 = await request(app.getHttpServer())
    .post('/auth/register')
    .send({ name: 'Noor', email: `noor_${Date.now()}@test.com`, password: '123456' });
  token = res1.body.access_token;

  // Register user 2
  const res2 = await request(app.getHttpServer())
    .post('/auth/register')
    .send({ name: 'Other', email: `other_${Date.now()}@test.com`, password: '123456' });
  token2 = res2.body.access_token;
});

afterAll(async () => await app.close());

// ── Auth ──────────────────────────────────────────────────────────────────────

it('❌ register with missing email', () =>
  request(app.getHttpServer())
    .post('/auth/register')
    .send({ name: 'Test', password: '123456' })
    .expect(400));

it('❌ register with missing password', () =>
  request(app.getHttpServer())
    .post('/auth/register')
    .send({ name: 'Test', email: 'test@test.com' })
    .expect(400));

it('❌ register duplicate email', async () => {
  const email = `dup_${Date.now()}@test.com`;
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ name: 'Test', email, password: '123456' })
    .expect(201);

  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ name: 'Test', email, password: '123456' })
    .expect(409);
});

it('❌ login with wrong password', () =>
  request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'x@x.com', password: 'wrong' })
    .expect(401));

it('❌ login with non-existent email', () =>
  request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'nobody@nowhere.com', password: '123456' })
    .expect(401));

// ── Todos - Auth Protection ───────────────────────────────────────────────────

it('❌ GET /todos without token', () =>
  request(app.getHttpServer()).get('/todos').expect(401));

it('❌ POST /todos without token', () =>
  request(app.getHttpServer()).post('/todos').send({ title: 'Test' }).expect(401));

it('❌ PUT /todos/:id without token', () =>
  request(app.getHttpServer()).put('/todos/1').send({ completed: true }).expect(401));

it('❌ DELETE /todos/:id without token', () =>
  request(app.getHttpServer()).delete('/todos/1').expect(401));

it('❌ invalid token is rejected', () =>
  request(app.getHttpServer())
    .get('/todos')
    .set('Authorization', 'Bearer invalidtoken123')
    .expect(401));


    // paging test 

    
// ── Todos - CRUD ──────────────────────────────────────────────────────────────

it('✅ creates a todo', async () => {
  const res = await request(app.getHttpServer())
    .post('/todos')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Buy milk', description: 'From the store' })
    .expect(201);

  expect(res.body.title).toBe('Buy milk');
  expect(res.body.description).toBe('From the store');
  expect(res.body.completed).toBe(false);
  todoId = res.body.id;
});

it('✅ creates a todo without description', async () => {
  const res = await request(app.getHttpServer())
    .post('/todos')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'No description todo' })
    .expect(201);

  expect(res.body.title).toBe('No description todo');
});

it('❌ creates todo with empty title', () =>
  request(app.getHttpServer())
    .post('/todos')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: '' })
    .expect(400));

it('❌ creates todo with missing title', () =>
  request(app.getHttpServer())
    .post('/todos')
    .set('Authorization', `Bearer ${token}`)
    .send({})
    .expect(400));

// ── Todos - Pagination ────────────────────────────────────────────────────────

it('✅ returns paginated todos', async () => {
  const res = await request(app.getHttpServer())
    .get('/todos?page=1&limit=10')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.total).toBeDefined();
  expect(res.body.totalPages).toBeDefined();
  expect(res.body.page).toBe(1);
});

it('✅ pagination limit is respected', async () => {
  // Create 5 todos
  for (let i = 0; i < 5; i++) {
    await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: `Todo ${i}` });
  }

  const res = await request(app.getHttpServer())
    .get('/todos?page=1&limit=3')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(res.body.data.length).toBeLessThanOrEqual(3);
});

it('✅ page 2 returns different results than page 1', async () => {
  const page1 = await request(app.getHttpServer())
    .get('/todos?page=1&limit=2')
    .set('Authorization', `Bearer ${token}`);

  const page2 = await request(app.getHttpServer())
    .get('/todos?page=2&limit=2')
    .set('Authorization', `Bearer ${token}`);

  const ids1 = page1.body.data.map((t: any) => t.id);
  const ids2 = page2.body.data.map((t: any) => t.id);
  const overlap = ids1.filter((id: number) => ids2.includes(id));
  expect(overlap.length).toBe(0);
});

// ── Todos - Update ────────────────────────────────────────────────────────────

it('✅ marks todo as completed', async () => {
  const res = await request(app.getHttpServer())
    .put(`/todos/${todoId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ completed: true })
    .expect(200);

  expect(res.body.completed).toBe(true);
});

it('✅ updates todo title', async () => {
  const res = await request(app.getHttpServer())
    .put(`/todos/${todoId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Updated title' })
    .expect(200);

  expect(res.body.title).toBe('Updated title');
});

// ── Todos - Isolation ─────────────────────────────────────────────────────────

it('✅ user 2 cannot see user 1 todos', async () => {
  const res = await request(app.getHttpServer())
    .get('/todos')
    .set('Authorization', `Bearer ${token2}`)
    .expect(200);

  const ids = res.body.data.map((t: any) => t.id);
  expect(ids).not.toContain(todoId);
});

// ── Todos - Delete ────────────────────────────────────────────────────────────

it('✅ deletes a todo', () =>
  request(app.getHttpServer())
    .delete(`/todos/${todoId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200));

it('❌ deleted todo no longer exists', async () => {
  const res = await request(app.getHttpServer())
    .get('/todos')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  const ids = res.body.data.map((t: any) => t.id);
  expect(ids).not.toContain(todoId);
});