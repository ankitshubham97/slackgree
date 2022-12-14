import axios from "axios";
import { collectDetailsModalLayout } from '../layouts/collectDetailsModal.layout';
import { homeLayout } from '../layouts/home.layout';
import logger, { prettyJSON } from "../utils/logger";

class SlackService {
  public BOT_USER_OAUTH_TOKEN = process.env.BOT_USER_OAUTH_TOKEN ?? '';

  public async publishCollectDetailsModal({channelId, fileId, ts, triggerId}:{channelId: string, fileId: string, ts: string, triggerId: string}): Promise<void> {
    const response = await axios.post(
      `https://slack.com/api/views.open`,
      {
        trigger_id: triggerId,
        view: collectDetailsModalLayout({channelId, fileId, ts}),
      },
      {
        headers: {
          'Authorization': `Bearer ${this.BOT_USER_OAUTH_TOKEN}`,
        }
      }
    );
    return;
  }

  public async getEmailFromSlackId(slackId: string): Promise<string | null> {
    const config = {
      method: 'get',
      url: `https://slack.com/api/users.profile.get?user=${slackId}`,
      headers: { 
        'Authorization': `Bearer ${this.BOT_USER_OAUTH_TOKEN}`,
      }
    };
    const response = await axios(config);
    if (!(response.status === 200 && response.data?.ok && response.data?.profile?.email)) {
      return null;
    }
    return response.data.profile.email;
  }

  public async publishHomeTab({userId}:{userId: string}): Promise<void> {
    const response = await axios.post(
      `https://slack.com/api/views.publish`,
      {
        user_id: userId,
        view: homeLayout(),
      },
      {
        headers: {
          'Authorization': `Bearer ${this.BOT_USER_OAUTH_TOKEN}`,
        }
      }
    );
    return;
  }

  public async postMessage ({sink, thread_ts, text='You have a new message!', blocks, metadata}:{sink: string, thread_ts?: string, text?: string, blocks?: string, metadata?: string}): Promise<void> {
    const body = {
      channel: sink,
      text,
      thread_ts,
      blocks,
      metadata
    };
    const response = await axios.post(
      `https://slack.com/api/chat.postMessage`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${this.BOT_USER_OAUTH_TOKEN}`,
        }
      }
    );
    if (!response || response.status != 200 || response.data.ok === false) {
      logger.error(`Failed to post chat, request body: ${prettyJSON(body)} response status: ${response.status} response data: ${prettyJSON(response.data)}`);
      return;
    }
    logger.info(prettyJSON(response.data));
    return;
  }
}

export default SlackService;
