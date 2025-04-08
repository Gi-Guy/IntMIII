
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.ts';
import mongoose from 'mongoose';
import { UserModel } from '../src/models/user.model.ts';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/blog-test');
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('User Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        password: 'test1234',
        firstName: 'Test',
        lastName: 'User',
        birthDate: '2000-01-01',
        gender: 'male'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should fail to register an existing user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        password: 'test1234',
        firstName: 'Test',
        lastName: 'User',
        birthDate: '2000-01-01',
        gender: 'male'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Username already exists');
  });

  it('should login user and return a token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'testuser', password: 'test1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'testuser', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid username or password');
  });
});
