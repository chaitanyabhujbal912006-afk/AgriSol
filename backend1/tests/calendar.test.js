const request = require('supertest');
const { app } = require('../src/app');

describe('AgriSol Growth Calendar Endpoints', () => {
  it('GET /api/v1/calendar/events without token should be unauthorized', async () => {
    const res = await request(app).get('/api/v1/calendar/events');
    expect(res.statusCode).toEqual(401);
  });

  it('POST /api/v1/calendar/events without token should be unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/calendar/events')
      .send({ cropName: 'Wheat', action: 'Irrigation', eventDate: '2026-08-10' });
    expect(res.statusCode).toEqual(401);
  });
});
