const request = require('supertest');
const { app } = require('../src/app');

describe('AgriSol Disease Diagnostic Endpoints', () => {
  it('GET /api/v1/disease/outbreak-map should be accessible publicly', async () => {
    const res = await request(app).get('/api/v1/disease/outbreak-map');
    expect(res.statusCode).toBeLessThan(500);
  });

  it('GET /api/v1/disease/my-reports without token should return 401', async () => {
    const res = await request(app).get('/api/v1/disease/my-reports');
    expect(res.statusCode).toEqual(401);
  });
});
