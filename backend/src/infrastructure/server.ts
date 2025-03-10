import * as express from 'express';
import { handleError, notFoundHandler } from './middleware/handle-error.middleware';
import { roomRouter } from './routers/room.router';
import { billboardRouter } from './routers/billboard.router';
import { bookingRouter } from './routers/booking.router';

const app = express();
app.use(express.json());
app.use( roomRouter, billboardRouter, bookingRouter);
app.use(notFoundHandler);
app.use(handleError);
export const server = app;

