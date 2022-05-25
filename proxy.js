const request = require('request');

let clientHeadersBlacklist = new Set([
	'host'
]);
let serverHeadersBlacklist = new Set([
    'connection',
]);

const proxy = method => (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Credentials', true);

	// /https://google.com -> https://google.com
    const url = req.url.substr(1);

    // forward client headers to server
    var headers = {};
    for (var header in req.headers) {
        if (!clientHeadersBlacklist.has(header.toLowerCase())) {
            headers[header] = req.headers[header];
        }
    }
    headers['X-Fowarded-For'] = getForwardedFor(req);

    request(url, {method, headers})
        .on('response', function (page) {
            res.statusCode = page.statusCode;
            // include only desired headers
            for (var header in page.headers) {
                if (!serverHeadersBlacklist.has(header)) {
                    res.header(header, page.headers[header]);
                }
            }
            // flush before pipe to avoid overwrite
            res.flushHeaders();
        })
        .on('end', () => res.end())
        .pipe(res);
};

function getForwardedFor (req) {
    const forwardedFor = req.headers['X-Fowarded-For'] || "";
    const sep = forwardedFor ? ',' : '';
    return forwardedFor + sep + req.connection.remoteAddress;
}

/*
opts handler allows us to use our own CORS preflight settings
*/
function opts (req, res, next) { // Couple of lines taken from http://stackoverflow.com/questions/14338683
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET'); // Only allow GET for now
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    res.header('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hrs if supported
    res.send(200);
    next();
}

const get = proxy('GET');
const post = proxy('POST');

module.exports = {get, post, opts};
