const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('./routes/app');

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', () => {
    return request(app)
      .get('/')
      .expect(200);
});