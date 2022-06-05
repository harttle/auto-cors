import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const RequestHeaderPrefix = 'auto-cors-request-header-';

const clientHeadersBlacklist = new Set([
  'host',
]);
const serverHeadersBlacklist = new Set([
  'connection',
]);

const proxy = (method) => async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', true);

  // /https://google.com -> https://google.com
  const url = req.url.substr(1);

  // TODO extract getRequestHeaders()
  // forward client headers to server
  const requestHeaders = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (clientHeadersBlacklist.has(name)) continue;
    if (name.startsWith(RequestHeaderPrefix)) continue;
    requestHeaders[name] = value;
  }
  for (const [name, value] of Object.entries(req.headers)) {
    if (name.startsWith(RequestHeaderPrefix)) {
      const forwardName = name.slice(RequestHeaderPrefix.length);
      requestHeaders[forwardName] = value;
    }
  }
  requestHeaders['X-Fowarded-For'] = getForwardedFor(req);

  if (url.includes('/resolver/api')) {
    const config = readFileSync(resolve(__dirname, 'config.json'), 'utf8');
    res.header('Content-Type', 'application/json');
    return res.end(config);
  }

  const body = req.rawBody.length ? req.rawBody : undefined;
  console.log(`${method} ${url} [${body?.length || 0} bytes]`);
  try {
    const response = await fetch(url, {method, headers: requestHeaders, body})

    res.statusCode = response.status;

    // TODO use filterHeaders
    // include only desired headers
    const headers = filterHeaders(Object.keys(response.headers), serverHeadersBlacklist);
    for (const header of headers) {
      res.header(header, page.headers[header]);
    }

    // TODO remove
    // flush before pipe to avoid overwrite
    res.flushHeaders();
    response.body.pipe(res);
    console.log('ended with', response.rawBody)
  } catch (err) {
    res.statusCode = 500;
    res.end(err.stack);
    console.error(err.stack);
  }
};
function* filterHeaders(headers, blacklist) {
  for (const header of headers) {
    if (!blacklist.has(header)) yield header;
  }
}
function getForwardedFor(req) {
  const forwardedFor = req.headers['X-Fowarded-For'] || '';
  const sep = forwardedFor ? ',' : '';
  return forwardedFor + sep + req.connection.remoteAddress;
}

/**
 * opts handler allows us to use our own CORS preflight settings
 */
export function options(req, res) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, HEAD, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
  res.sendStatus(200);
}

export const get = proxy('GET');
export const post = proxy('POST');
