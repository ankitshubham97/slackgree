import dotenv from 'dotenv';
dotenv.config();

import App from './app';
import EventController from './controllers/event.controller';
import InteractionController from './controllers/interaction.controller';

const app = new App([
  new EventController(),
  new InteractionController(),
]);
app.listen();
