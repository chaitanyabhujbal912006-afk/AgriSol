const request = require('supertest');
const { app } = require('../src/app');

describe('AgriSol Health & Info Endpoints', () => {
  it('GET /health should return 200 with service info', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'AgriSol Backend');
  });

  it('GET / should return 200 with backend welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.message).toContain('AgriSol Backend API');
  });

  it('GET /api/v1 should return API status and endpoints map', async () => {
    const res = await request(app).get('/api/v1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.endpoints).toHaveProperty('soil');
    expect(res.body.endpoints).toHaveProperty('calendar');
  });
});
