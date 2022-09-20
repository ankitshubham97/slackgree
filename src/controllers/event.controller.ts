import express from 'express';

import Controller from '../interfaces/controller.interface';

import logger, {prettyJSON} from '../utils/logger';

class EventController implements Controller {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/event`, this.processEvent);
  }


  private processEvent = async (
    request: express.Request,
    response: express.Response
  ) => {
    logger.info(prettyJSON(request.body));
    if (request.body.type === 'url_verification') {
      response.send(request.body.challenge);
      return;
    } else if (request.body.type === 'event_callback') {
      // TODO: Implement this.
    }
    response.send();
  };
}

export default EventController;
