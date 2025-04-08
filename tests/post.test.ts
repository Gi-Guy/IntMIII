import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { PostModel } from '../src/models/post.model';
import { UserModel } from '../src/models/user.model';

let token = '';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/blog-test');
  await PostModel.deleteMany({});
  await UserModel.deleteMany({});

  await request(app).post('/api/users/register').send({
    username: 'postuser',
    password: 'test1234',
    firstName: 'Post',
    lastName: 'Tester',
    birthDate: '2000-01-01',
    gender: 'male'
  });

  const res = await request(app)
    .post('/api/users/login')
    .send({ username: 'postuser', password: 'test1234' });

  token = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Post Routes', () => {
  it('should create a new post with valid token', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Cookie', [`token=${token}`])
      .send({
        title: 'Test Post',
        content: 'This is a test post.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Post created');
    expect(res.body.post.title).toBe('Test Post');
  });

  it('should fail to create post without token', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Should Fail', content: 'No token here' });

    expect(res.statusCode).toBe(401);
  });

  it('should get all posts with comment count', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('commentCount');
  });
});