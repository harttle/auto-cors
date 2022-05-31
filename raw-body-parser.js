function rawBodyParser(req, res, next) {
    req.rawBody = Buffer.from([]);

    req.on('data', function(chunk) {
        req.rawBody = Buffer.concat([req.rawBody, chunk]);
    });

    req.on('end', function() {
        next();
    });
}

module.exports = { rawBodyParser };
