import { server as corsServer } from '..';
// import fetch from 'node-fetch';
import util from 'util';

const corsPort = process.env.TEST_CORS_PORT || 9307;
const host = process.env.TEST_HOST || '127.0.0.1';
const homepage = `http://${host}:${corsPort}`;

beforeAll(async () => {
  await util.promisify(corsServer.listen).call(corsServer, corsPort, host)
});

describe('e2e', () => {
  describe('homepage', () => {
    it.only('should response with README.md', async () => {
      const response = await window.fetch(`https://example.com`);
      // const response = await fetch(`${homepage}/https://example.com`);
      expect(response.status).toBe(200);
      expect(response.text()).toContain('This is Auto CORS server');
    });
  });
  describe('simple request', () => {
    it('should allow GET https://example.com', async () => {
      const response = await request(server)
        .get('/https://example.com')
        .set('Accept', 'text/plain')
        .set('origin', 'http://localhost')
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('get example');
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost');
    });
    it('should allow POST https://example.com', async () => {
      const response = await request(server)
        .post('/https://example.com')
        .send({ foo: 'FOO' })
        .set('Content-Type', 'application/json')
        .set('origin', 'http://localhost')
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('POST {"foo":"FOO"}');
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost');
    });
    it('should set Access-Control-Allow-Origin="*" if origin absent', async () => {
      const response = await request(server)
        .get('/https://example.com')
      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });
  describe('preflight request', () => {
    it('should allow preflight https://example.com', async () => {
      const response = await request(server)
        .options('/https://example.com')
        .set('origin', 'http://localhost')
        .set('access-control-request-headers', 'X-Geo, X-Geo-City');
      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
      expect(response.headers['access-control-allow-methods']).toBe('POST, GET, PUT, HEAD, OPTIONS, DELETE');
      expect(response.headers['access-control-allow-headers']).toBe('X-Geo, X-Geo-City');
    });
  });
  describe('credentials', () => {
    it('should allow credentials for GET https://example.com', async () => {
      const response = await request(server)
        .get('/https://example.com')
      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
    it('should allow credentials for GET https://example.com', async () => {
      const response = await request(server)
        .options('/https://example.com')
      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });
});