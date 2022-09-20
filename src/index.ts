import dotenv from 'dotenv';
dotenv.config();

import App from './app';
import EventController from './controllers/event.controller';

const app = new App([
  new EventController(),
]);
app.listen();
