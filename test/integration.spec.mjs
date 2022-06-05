import { server } from '..';
import jest from 'jest';
import request from 'supertest';

jest.mock('node-fetch', () => {
  const { Response } = require('./mock-response');
  return (url, options) => {
    console.log('mock request', url, options)
    if (url === 'https://example.com' && options.method === 'HEAD')
      return new Response(200, '')
    if (url === 'https://example.com' && options.method === 'GET')
      return new Response(200, 'get example')
    if (url === 'https://example.com' && options.method === 'POST')
      return new Response(200, 'POST ' + options.body)
    return new Response(404, 'not found')
  }
});

describe('integration', () => {
  describe('homepage', () => {
    it('should response with README.md', async () => {
      const response = await request(server).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('This is Auto CORS server');
    });
  });
  describe('simple request', () => {
    it.only('should allow GET https://example.com', async () => {
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
        .set('access-control-request-headers', 'X-Geo, X-Geo-City')
      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
      expect(response.headers['access-control-allow-methods']).toBe('POST, GET, PUT, HEAD, OPTIONS, DELETE');
      expect(response.headers['access-control-allow-headers']).toBe('X-Geo, X-Geo-City');
    });
  });
  describe('credentials', () => {
    it('should allow credentials for GET https://example.com', async () =>{
      const response = await request(server)
        .get('/https://example.com')
      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
    it('should allow credentials for GET https://example.com', async () =>{
      const response = await request(server)
        .options('/https://example.com')
      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });
});
