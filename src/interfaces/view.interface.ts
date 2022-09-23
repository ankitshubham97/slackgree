interface ViewI {
  type: string;
  title: {
    type: string;
    text: string;
  };
  blocks: any[];
  close: {
    type: string;
    text: string;
    emoji: boolean;
  };
  submit: {
    type: string;
    text: string;
    emoji: boolean;
  };
  private_metadata: string;
  callback_id: string;
  clear_on_close: boolean;
  notify_on_close: boolean;
  external_id: string;
  submit_disabled: boolean;

  // Undocumented fields duh
  state: {
    values: any;
  };

}

export default ViewI;