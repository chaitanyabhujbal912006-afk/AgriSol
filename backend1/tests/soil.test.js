const request = require('supertest');
const { app } = require('../src/app');

describe('AgriSol Soil Analysis Endpoints', () => {
  it('GET /api/v1/soil/history without token should be unauthorized', async () => {
    const res = await request(app).get('/api/v1/soil/history');
    expect(res.statusCode).toEqual(401);
  });

  it('POST /api/v1/soil/analyze without auth header should return 401', async () => {
    const res = await request(app).post('/api/v1/soil/analyze');
    expect(res.statusCode).toEqual(401);
  });
});
