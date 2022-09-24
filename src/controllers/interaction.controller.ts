import axios, { ResponseType } from 'axios';
import express from 'express';
import * as fs from "fs";
import path from 'path';
import * as HelloSignSDK from "hellosign-sdk";

import Controller from '../interfaces/controller.interface';
import InteractionPayloadI, { MessageActionPayloadI, ViewSubmissionPayloadI } from '../interfaces/interactionPayload.interface';
import SlackService from '../services/slack.service';

import logger, { prettyJSON } from '../utils/logger';

class InteractionController implements Controller {
  public router = express.Router();
  public slackService = new SlackService();
  public HELLOSIGN_API_KEY = process.env.HELLOSIGN_API_KEY ?? '';
  public BOT_USER_OAUTH_TOKEN = process.env.BOT_USER_OAUTH_TOKEN ?? '';
  public SELF_URL = process.env.SELF_URL ?? '';
  public hellosignApi = new HelloSignSDK.SignatureRequestApi();

  constructor() {
    this.initializeRoutes();
    this.hellosignApi.username = this.HELLOSIGN_API_KEY;
  }

  private initializeRoutes() {
    this.router.post(`/interaction`, this.processInteraction);
  }

  private processInteraction = async (
    request: express.Request,
    response: express.Response
  ) => {
    response.send();
    if (!(request.body.payload)) {
      // Slack sends an undefined payload sometimes when the local tunnel is switched.
      return;
    }
    let payload = JSON.parse(request.body.payload) as InteractionPayloadI;
    logger.info(prettyJSON(payload));
    const { type } = payload;

    if (type === 'message_action') {
      const messageActionPayload = payload as MessageActionPayloadI;
      if (!await this.handleMessageAction(messageActionPayload)) {
        logger.error(`Error while handling message action`);
        return;
      }
    } else if (type === 'view_submission') {
      const viewSubmissionPayload = payload as ViewSubmissionPayloadI;
      const { success, errorMap } = await this.handleViewSubmission(viewSubmissionPayload);
      if (!success) {
        logger.error(`Error while handling view submission action`);
        return;
      }
    } else {
      logger.error(`Invalid type ${type}`);
    }
  };

  private handleMessageAction = async (messageActionPayload: MessageActionPayloadI): Promise<boolean> => {
    const callbackId = messageActionPayload.callback_id;
    if (callbackId === "send-to-get-signature" && messageActionPayload.message.files && messageActionPayload.message.files.length > 0) {
      const channelId = messageActionPayload.channel.id;
      const fileId = messageActionPayload.message.files[0].id;
      const ts = messageActionPayload.message.ts;
      const triggerId = messageActionPayload.trigger_id;
      await this.slackService.publishCollectDetailsModal({
        channelId,
        fileId,
        ts,
        triggerId
      })
    }
    return true;
  }

  private handleViewSubmission = async (viewSubmissionPayload: ViewSubmissionPayloadI): Promise<{success:boolean, errorMap: {[key in string]: string}}> => {
    try{
      const { view, user } = viewSubmissionPayload;
      const { state } = view;
      const { values } = state;
      const private_metadata = JSON.parse(view.private_metadata);
      const {action, taskId, buttonClicked} = (private_metadata);
      if (action === 'collect-details') {
        const {channelId, fileId, ts} = (private_metadata);
  
        // Get title.
        const title = (values["title"]["title"]["value"] as string).trim();
        // Get subject.
        const subject = (values["subject"]["subject"]["value"] as string).trim();
        // Get message.
        const message = (values["message"]["message"]["value"] as string).trim();
        // Get signerName.
        const signerName = (values["signerName"]["signerName"]["value"] as string).trim();
        // Get signerEmail.
        const signerEmail = (values["signerEmail"]["signerEmail"]["value"] as string).trim();
        // Get ccSlackIds.
        const ccSlackIds = values["ccSlackIds"]["ccSlackIds"]["selected_users"] as string[];
        
        // Get file.     
        const fileResponse = await axios({
          method: 'get',
          url: `https://slack.com/api/files.info?file=${fileId}`,
          headers: { 
            'Authorization': `Bearer ${this.BOT_USER_OAUTH_TOKEN}`, 
          }
        });
  
        if (!(fileResponse && fileResponse.status === 200 && fileResponse.data.ok)) {
          return {success: false, errorMap: {}};
        }
        const fileUrl = fileResponse.data?.file?.url_private_download ?? '' as string;
        
        const fileName = `${fileResponse.data?.file?.id}-${fileResponse.data?.file?.name}`;
        (await axios({
          method: 'get',
          url: fileUrl,
          headers: { 
            'Authorization': `Bearer ${this.BOT_USER_OAUTH_TOKEN}`, 
          },
          responseType: 'stream' as ResponseType,
        }))
          .data
          .pipe(fs.createWriteStream(path.join(__dirname, `../files/${fileName}`)));
        
        const data: HelloSignSDK.SignatureRequestSendRequest = {
          title,
          subject,
          message,
          signers: [
            {
              emailAddress: signerEmail,
              name: signerName,
              order: 0
            }
          ],
          ccEmailAddresses: [],
          fileUrl: [
            `${this.SELF_URL}/files/${fileName}`
          ],
          metadata: {
            channelId,
            fileId,
            ts
          },
          signingOptions: {
            draw: true,
            type: true,
            upload: true,
            phone: true,
            defaultType: HelloSignSDK.SubSigningOptions.DefaultTypeEnum.Draw,
          },
          testMode: true
        }
        await this.hellosignApi.signatureRequestSend(data);
      }
      return {success: true, errorMap: {}};
    } catch (e) {
      logger.error(e);
      return {success: false, errorMap: {}};
    }
  }

}

export default InteractionController;
