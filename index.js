const express = require('express');
const proxy = require('./proxy');
const server = express();
const { rawBodyParser } = require('./raw-body-parser');

server.use(rawBodyParser);
server.options(/^\/(https?:\/\/.+)/, proxy.opts);
server.get(/^\/(https?:\/\/.+)/, proxy.get);
server.post(/^\/(https?:\/\/.+)/, proxy.post);

module.exports = { server }
