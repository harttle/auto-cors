import express from 'express';
import {options, get, post} from './proxy';
import { rawBodyParser } from './raw-body-parser';
import { homepage } from './homepage';

export const server = express();

server.use(rawBodyParser);
server.get('/', homepage);
server.options(/^\/(https?:\/\/.+)/, options);
server.get(/^\/(https?:\/\/.+)/, get);
server.post(/^\/(https?:\/\/.+)/, post);
