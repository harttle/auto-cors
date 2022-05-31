const request = require('request');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const RequestHeaderPrefix = 'auto-cors-request-header-';

let clientHeadersBlacklist = new Set([
	'host'
]);
let serverHeadersBlacklist = new Set([
    'connection',
]);

const proxy = method => (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', Object.keys(req.headers).join());

	// /https://google.com -> https://google.com
    const url = req.url.substr(1);

    // forward client headers to server
    const headers = {};
    for (const [name, value] of Object.entries(req.headers)) {
        if (clientHeadersBlacklist.has(name)) continue
		if (name.startsWith(RequestHeaderPrefix)) continue
		headers[name] = value;
    }
    for (const [name, value] of Object.entries(req.headers)) {
		if (name.startsWith(RequestHeaderPrefix)) {
			const forwardName = name.slice(RequestHeaderPrefix.length)
			headers[forwardName] = value;
		}
    }
    headers['X-Fowarded-For'] = getForwardedFor(req);

	if (url.includes("/resolver/api")) {
		const config = readFileSync(resolve(__dirname, "config.json"), "utf8");
		res.header('Content-Type', "application/json");
		return res.end(config);
	}

	const body = req.rawBody.length ? req.rawBody : undefined;
	console.log(`${method} ${url} with body ${body}`);
    request(url, {method, headers, body })
        .on('response', function (page) {
            res.statusCode = page.statusCode;
            // include only desired headers
			const headers = filterHeaders(Object.keys(page.headers), serverHeadersBlacklist);
            for (const header of headers) {
				res.header(header, page.headers[header]);
            }
            // flush before pipe to avoid overwrite
            res.flushHeaders();
        })
        .on('end', () => res.end())
        .on('error', (err) => {
            res.statusCode = 500;
			res.end(err.stack)
		})
        .pipe(res);
};
function* filterHeaders(headers, blacklist) {
	for (const header of headers) {
		if (!blacklist.has(header)) yield header
	}
}
function getForwardedFor (req) {
    const forwardedFor = req.headers['X-Fowarded-For'] || "";
    const sep = forwardedFor ? ',' : '';
    return forwardedFor + sep + req.connection.remoteAddress;
}

/**
 * opts handler allows us to use our own CORS preflight settings
 */
function opts (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', req.method.toUpperCase());
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    res.sendStatus(200);
}

const get = proxy('GET');
const post = proxy('POST');

module.exports = {get, post, opts};
