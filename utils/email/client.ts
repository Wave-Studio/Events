import {
  SendEmailCommand,
  SendEmailRequest,
  SESClient,
} from "npm:@aws-sdk/client-ses";

export const sesClient = new SESClient({
  region: Deno.env.get("AWS_REGION") || "us-east-1",
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
});

/**
 * Send an email
 * @param to
 * @param subject
 * @param message Specific a fallback text version (required) and the html
 * @returns
 */
export const sendEmail = async (
  to: string[],
  subject: string,
  message: { fallback: string; html?: string },
) => {
  const params: SendEmailRequest = {
    // Due to fresh config stuff
    // Deno.env.get("AWS_EMAIL_SOURCE") ||
    Source: `"Events" <events@wavestudios.one>`,
    Destination: {
      ToAddresses: to,
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Text: {
          Charset: "UTF-8",
          Data: message.fallback,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };

  if (message.html) {
    params.Message!.Body!.Html = {
      Charset: "UTF-8",
      Data: message.html,
    };
  }

  return await sesClient.send(new SendEmailCommand(params as SendEmailRequest));
};
