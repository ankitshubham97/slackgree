# Slackgree
_Do hellosign within slack! Create & cancel sign requests, send reminders and get all updates in slack! You don't need to open yet-another window for hellosign when you can do it all in slack!_

## Problems with the current online document signing (ODS) products?
### Yet another dashboard
ODS have their own dashboard with which the requesters interact. Imagine an HR and they could already be overwhelmed with tons of other dashboards (viz. ATS, HRMS). Having another dashboard just adds to the burden!
### Don't prefer the mobile apps
People usually don't prefer mobile version of ODS as clear from various sources. What if they need to check on something but they are not carrying their office laptops on them?
### Trackability issue
Most ODS products lack the ability to keep the requester notified on the progress of online signature journey.

## Solution: Enters Slackgree 😎
ODS products are usually used in organizations. There is another kind of software that is used almost mandatorily, and that is an intra-organizational IM app. And it would be safe to say that slack is one of the most prominent ones till date! Also, it has awesome notification infrastructure and mobile apps as well!
Here, enters Slackgree! Slackgree is a slack bot that enables requester to:
1. send request to get online signature
2. cancel any outgoing request
3. send reminder to the signer
4. get every status updates (prominent ones being request sent, request viewed, request denied, request signed and more)
... and all of this without them opening the Hellosign dashboard. Slackgree turns Slack into a mini-hellosign dashboard.

## Inspiration
I am a developer and I have friends who would joke to make their life easier by integrating ATS, HRMS, ODS and other standalone products into slack for the reasons that are already pointed out in the above 'Problems' section. I have integrated a few other standalone products into IM softwares. They are using it & ready to pay as well!

## Product walkthrough: Engineering
Slackgree is a slack bot; so by the virtue of being a slack bot, its completely headless. Slackgree could be seen as a 2-way communication bridge between slack and hellosign. A requestor initiates a command from slack, Slackgree captures it and sends it to the hellosign backend via hellosign API(SDK). Similarly, slackgree listens to the different events pertaining to signature requests arising from hellosign backend, handles them and display in the slack accordingly. This section is a bit abstract and aims to make the readers understand how slackgree is designed and the three actors viz slack, hellosign and slackgree work together. For more clarity, please see the demo.

### Why slackgree is special
1. It is completely headless & stateless. It does not store any state or data flowing through slack-to-hellosign and vice-versa. It is just a 2-way bridge between slack and hellosign. You would notice that the source code does not indicate having any sort of database. This makes slackgree 100% secure and respects data privacy.
2. People already using slack would find it easy to use as well. So, learning curve in using slackgree is very shallow. It further would result in improved effciency of users.
3. Slackgree takes the goodness of slack (good notification infratructure and nice mobile app) and aims to build a good mini-dashboard for hellosign.

### Slack-to-Hellosign way
1. Requestor initiates a command (it could be initiating a signature request, sending reminder or canceling an outgoing request). Also, the command could be in form of message shortcuts or some special keyword.
2. Slackgree captures the command, parses it and sends it to hellosign backend via hellosign SDK. This could be calling SDK's `signatureRequestSend`, `signatureRequestRemind`, `signatureRequestCancel` etc.
3. Hellosign backend handles the request the same way it would have if received from hellosign dashboard!

### Hellosign-to-Slack way
1. Slackgree listens to hellosign events (https://developers.hellosign.com/docs/events/overview/) via callbacks.
2. An event happens (e.g. it could be a signer signs the document).
3. Hellosign backend detects this and sends the event to the callback URL where slackgree is listening.
4. slackgree receives the event, recognizes what happened and handles appropriately (by handling, it could notify the requester on slack.)

## Product walkthrough: End user
_Disclaimer: You could also watch the demo to understand this section!_

<ins><b>Send documents for getting signature</b></ins>
1. Go to `Messages` tab of slackgree app.
2. Upload any document in the chat that you want to sent to be signed.
3. Click on 'More Actions' (⋮) and select 'Send to get signature' from the drop down menu.
4. Enter additional details in the modal and hit send!

<ins><b>Get live updates for document</b></ins>
1. You would get the updates in the form of a thread where the initial message is the document that you uploaded in the chat.
2. You would get updates on:
 a. when the request was sent,
 b. when the request was viewed,
 c. when the request was signed,
 d. when the signed request is available for download and the download link,
 e. when the request was declined,
 f. when the request bounced,
 g. when the request was invalid,
 h. when the request was canceled by the requester.

<ins><b>Send reminder for the already-out document</b></ins>
1. Go to the thread which corresponds to the already-out document.
2. Type `remind`.

<ins><b>Cancel request for the already-out document</b></ins>
1. Go to the thread which corresponds to the already-out document.
2. Type `cancel`.

## Challenges faced:

1. Developing this required an https endpoint for hellosign callback url and also event/interaction endpoint for slackgree. I was able to use a free http-tunneling software but the endpoint kept on rotating every few hours. It would also just misbehave and won't forward the traffic to my dev box. It was annoying to say the least!
2. UX: Slackgree is a mini dashboard and that too on slack. Slack comes with its own set of UI restrictions. So designing a good UX was tough.


## [Hellosign Hackathon 2022][Hellosign Hackathon]
This project is developed as part of the [Hellosign Hackathon][Hellosign Hackathon]. If you are a panelist/judge/reviewer, please check out the following steps.

### For the panelists/judges/reviewers of Hellosign Hackathon 2022
The demo video is here: [Demo Video]

You would need to join a demo slack workspace using this invite link: https://join.slack.com/t/slackgree/shared_invite/zt-1gfilqn2q-BJG57VbEPpZizRvOFoWf0A

You should be able to locate the `Slackgree-Bot` app in the left pane. If not, please click `Add apps` under `Apps` section and add `Slackgree-Bot` from the list.

Please follow the demo or the steps listed in `Product walkthrough: End user` section in this readme to learn how to interact.

[Hellosign Hackathon]: <https://hellosignhackathon2022.devpost.com/>
[Demo Video]: <https://youtu.be/KsMYv6uA-rc>
