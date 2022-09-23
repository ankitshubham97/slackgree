import ViewI from './view.interface';

interface InteractionPayloadI {
  type: "view_submission" | "block_actions" | "message_action";
  user: {
    id: string;
    username: string;
    name: string;
    team_id: string;
  };
  team: {
    id: string;
    domain: string;
  };
  trigger_id: string;
  token: string;
}

interface BlockActionPayloadI extends InteractionPayloadI {
  view: ViewI;
  response_url: string;
  actions: any[],
  hash: string,
  api_app_id: string;
}

interface ViewSubmissionPayloadI extends InteractionPayloadI {
  view: ViewI;
  response_urls: any[];
  api_app_id: string;
}

interface MessageActionPayloadI extends InteractionPayloadI {
  channel: {
    id: string;
    name: string;
  };
  message: {
    type: string;
    text: string;
    files: File[];
    user: string;
    ts: string;
    team: string;
    blocks: any[];
  };
  callback_id: string;
}

interface File {
  id: string,
  created: number,
  timestamp: number,
  name: string,
  title: string,
  mimetype: string,
  filetype: string,
  pretty_type: string,
  user: string,
  user_team: string,
  editable: boolean,
  size: number,
  mode: string,
  is_external: boolean,
  external_type: string
  is_public: boolean,
  public_url_shared: boolean,
  display_as_bot: boolean,
  username: string
  url_private: string,
  url_private_download: string,
  media_display_type: string,
  permalink: string,
  permalink_public: string,
  is_starred: boolean,
  has_rich_preview: boolean,
  file_access: string
}

export default InteractionPayloadI;
export { BlockActionPayloadI, ViewSubmissionPayloadI, MessageActionPayloadI };