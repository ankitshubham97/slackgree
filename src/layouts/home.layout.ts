export const homeLayout = () => {
  return {
    "type": "home",
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Here's how you can use Slackgree:"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "image",
            "image_url": "https://i.postimg.cc/FH2cbr1Y/slackgree.jpg",
            "alt_text": "placeholder"
          }
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "1️⃣ *Send documents for getting signature*\n\n1. Go to messages tab.\n2. Upload any document in the chat that you want to sent to be signed.\n3. Click on 'More Actions' (⋮) and select 'Send to get signature' from the drop down menu.\n4. Enter additional details in the modal and hit send!"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "2️⃣ *Get live updates for document*\n\n1. You would get the updates in the form of a thread where the initial message is the document that you uploaded in the chat.\n2. You would get updates on:\n  a. when the request was sent,\n  b. when the request was viewed,\n  c. when the request was signed,\n  b. when the signed request is available for download and the download link,\n  b. when the request was declined,\n  b. when the request bounced,\n  b. when the request was invalid,"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "3️⃣ *Send reminder for the already-out document*\n\n1. Go to the thread which corresponds to the already-out document.\n2. Type _remind_."
        }
      },
      {
        "type": "divider"
      }
    ]
  }
}