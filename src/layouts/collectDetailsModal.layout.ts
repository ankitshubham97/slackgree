export const collectDetailsModalLayout = ({channelId, fileId, ts}:{channelId: string, fileId: string, ts: string}) => {
  return {
    "type": "modal",
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "title": {
      "type": "plain_text",
      "text": "Send for signature",
      "emoji": true
    },
    "private_metadata": `{"action": "collect-details", "channelId": "${channelId}", "fileId": "${fileId}", "ts": "${ts}"}`,
    "blocks": [
      {
        "block_id": "title",
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "title",
        },
        "label": {
          "type": "plain_text",
          "text": "Title",
          "emoji": true
        }
      },
      {
        "block_id": "subject",
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "subject",
        },
        "label": {
          "type": "plain_text",
          "text": "Subject",
          "emoji": true
        }
      },
      {
        "block_id": "message",
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "message",
        },
        "label": {
          "type": "plain_text",
          "text": "Message",
          "emoji": true
        }
      },
      {
        "block_id": "signerName",
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "signerName",
        },
        "label": {
          "type": "plain_text",
          "text": "Signer Name",
          "emoji": true
        }
      },
      {
        "block_id": "signerEmail",
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "action_id": "signerEmail",
        },
        "label": {
          "type": "plain_text",
          "text": "Signer Email",
          "emoji": true
        }
      },
      {
        "type": "section",
        "block_id": "ccSlackIds",
        "text": {
          "type": "mrkdwn",
          "text": "Select users to put in cc list"
        },
        "accessory": {
          "action_id": "ccSlackIds",
          "type": "multi_users_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select users to put in cc list"
          }
        }
      }
    ]
  }
}