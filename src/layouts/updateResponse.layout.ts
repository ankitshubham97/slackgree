
export const updateResponseLayout = ({heading, title, signerEmail, signerName }: {heading: string, title: string, signerEmail: string, signerName : string}) => {
  return [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `${heading}`
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*Signer Name*\n ${signerName}`
          },
          {
            "type": "mrkdwn",
            "text": `*Signer Email*\n ${signerEmail}`
          },
          {
            "type": "mrkdwn",
            "text": `*Title:*\n ${title}`
          },
        ]
      }
    ];
}