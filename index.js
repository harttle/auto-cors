const express = require('express');
const proxy = require('./proxy');
const server = express();

server.options('/', proxy.opts);
server.get(/^\/(https?:\/\/.+)/, proxy.get);
server.post(/^\/(https?:\/\/.+)/, proxy.post);

module.exports = { server }
