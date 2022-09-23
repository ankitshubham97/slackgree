import axios, { ResponseType } from 'axios';
import express, { response } from 'express';
import * as fs from "fs";
import { writeFile } from 'fs/promises';
import path from 'path';
import formidable from 'formidable';
import { updateResponseLayout } from '../layouts/updateResponse.layout';

import Controller from '../interfaces/controller.interface';

import logger, {prettyJSON} from '../utils/logger';
import SlackService from '../services/slack.service';

class EventController implements Controller {
  public router = express.Router();
  public HELLOSIGN_API_KEY = process.env.HELLOSIGN_API_KEY ?? '';
  public BOT_USER_OAUTH_TOKEN = process.env.BOT_USER_OAUTH_TOKEN ?? '';
  public slackService = new SlackService();
  public HELLOSIGN_EVENTS = [
    'signature_request_sent',
    'signature_request_viewed',
    'signature_request_signed',
    'signature_request_downloadable',
    'signature_request_declined',
    'signature_request_remind',
    'signature_request_email_bounce',
    'signature_request_invalid',
  ];

  public EVENTS_TEXT_MAPPING : { [key: string]: string } = {
    'signature_request_sent': 'You have sent a signature request',
    'signature_request_viewed': 'The signature request is viewed by the signer',
    'signature_request_signed':  'Yay! The signature request is viewed by the signer',
    'signature_request_downloadable': 'The signed signature request copy is now downloadable',
    'signature_request_declined': 'Oops! The signature request is declined by the signer',
    'signature_request_remind': 'Ay-ay! The signer is reminded of the signature request',
    'signature_request_email_bounce': 'Oops! The signer email seems incorrect; it has bounced',
    'signature_request_invalid': 'Oops! The signature request is invalid',
  };
  
  public getHeading = function ({eventType, signatureRequestId}: {eventType: string, signatureRequestId:string}) : string {
    if (eventType === 'signature_request_sent') {
      return `You have sent a *<https://app.hellosign.com/editor/view/super_group_guid/${signatureRequestId}|signature request>*`
    }
    if (eventType === 'signature_request_viewed') {
      return `The signer has viewed the *<https://app.hellosign.com/editor/view/super_group_guid/${signatureRequestId}|signature request>*`
    }
    if (eventType === 'signature_request_signed') {
      return `The signer has signed the *<https://app.hellosign.com/editor/view/super_group_guid/${signatureRequestId}|signature request>*`
    }
    if (eventType === 'signature_request_downloadable') {
      return `The signed signature request is now downloadable *<https://app.hellosign.com/attachment/downloadCopy/guid/${signatureRequestId}|here>*`
    }
    if (eventType === 'signature_request_declined') {
      return `The signer has declined the *<https://app.hellosign.com/editor/view/super_group_guid/${signatureRequestId}|signature request>*`
    }
    if (eventType === 'signature_request_remind') {
      return `The signer is reminded about the *<https://app.hellosign.com/editor/view/super_group_guid/${signatureRequestId}|signature request>*`
    }
    if (eventType === 'signature_request_email_bounce') {
      return `The email has bounced for the *<https://app.hellosign.com/editor/view/super_group_guid/${signatureRequestId}|signature request>*`
    }
    if (eventType === 'signature_request_invalid') {
      return `The *<https://app.hellosign.com/editor/view/super_group_guid/${signatureRequestId}|signature request>* is invalid`
    }
    return `Unknown event caught: ${eventType}`;
  };

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/slack-event`, this.processSlackEvent);
    this.router.post(`/hellosign-event`, this.processHellosignEvent);
  }

  private processHellosignEvent = async (
    request: express.Request,
    response: express.Response
  ) => {
    const form = formidable({});

    form.parse(request, async (err: { httpCode: any; }, fields: any, files: any) => {
      if (err) {
        logger.error(String(err));
        return;
      }
      logger.info(JSON.parse(fields.json).event.event_type);
      const payload = JSON.parse(fields.json);
      const eventType = payload?.event?.event_type;
      if (this.HELLOSIGN_EVENTS.includes(eventType)) {
        const { title, message, subject, metadata, signatures, signature_request_id:signatureRequestId } = payload?.signature_request;
        const { channelId, ts} = metadata;
        const signerEmail = signatures[0]?.signer_email_address
        const signerName = signatures[0]?.signer_name;
        await this.slackService.postMessage({
          sink: channelId,
          thread_ts: ts,
          text: this.EVENTS_TEXT_MAPPING[eventType],
          blocks: JSON.stringify(
            updateResponseLayout({
              heading: this.getHeading({eventType, signatureRequestId}),
              title,
              signerEmail,
              signerName
            })
          )
        })
      } else {
        logger.error(`Unhandled eventType ${eventType}`);
      }
    });
    response.set('content-Type', 'text/plain');
    response.status(200).send('Hello API Event Received');
  };

  private processSlackEvent = async (
    request: express.Request,
    response: express.Response
  ) => {
    logger.info(prettyJSON(request.body));
    if (request.body.type === 'url_verification') {
      response.send(request.body.challenge);
      return;
    } else if (request.body.type === 'event_callback') {
      const event = request.body.event;
      const {user, type} = event;
      if (event.type === 'message' && event.subtype === 'subtype') {
        const fileId = event.files?.[0]?.id ?? '' as string;
        const channelId = event.channel ?? '' as string;
        const ts = event.ts ?? '' as string;
        
      }
      response.send();
    }
  }
}

export default EventController;
