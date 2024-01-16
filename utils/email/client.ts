import {
  SESClient,
  SendEmailCommand,
  SendEmailRequest,
} from "npm:@aws-sdk/client-ses";

export const sesClient = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
});

export const sendEmail = async (
  to: string[],
  subject: string,
  message: { content: string; html: boolean },
) => {
  const params: SendEmailRequest = {
    Source: `"Events" <events@wavestudios.one>`,
    Destination: {
      ToAddresses: to,
    },
    Message: {
      /* required */
      Body: {
        /* required */
        [message.html ? "Html" : "Text"]: {
          Charset: "UTF-8",
          Data: message.content,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
  return await sesClient.send(new SendEmailCommand(params as SendEmailRequest));
};
