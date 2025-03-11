import * as express from 'express';
import { handleError, notFoundHandler } from './middleware/handle-error.middleware';
import { roomRouter } from './routers/room.router';
import { billboardRouter } from './routers/billboard.router';
import { bookingRouter } from './routers/booking.router';
import { seatRouter } from './routers/seat.router';
import * as cors from "cors"
const app = express();
import * as bodyParser from 'body-parser';
const cookieParser = require('cookie-parser');

const bodyParserUrlencoded = bodyParser.urlencoded({ extended: true, limit: '50mb' });
const bodyParseJson = bodyParser.json({ limit: '50mb' });
const parserCookie = cookieParser();
app.use(
    express.json(),
    bodyParserUrlencoded,
    bodyParseJson,
    parserCookie    
);
app.use(cors(
   { origin: '*',
    methods: ['POST', 'GET', 'PUT', 'OPTION', 'DELETE'], 
    allowedHeaders: ['Content-Type'],}
));

app.use(roomRouter, billboardRouter, bookingRouter, seatRouter);
app.use(notFoundHandler);
app.use(handleError);

export const server = app;

