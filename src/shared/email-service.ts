import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import nodemailer from "nodemailer";
import { SERVICE_EMAIL_ADDRESS } from "./config";
import { getEmailTemplate } from "./email-template";
import { logClient } from "../shared/logging-utils";

const fromBase64 = Buffer.from(SERVICE_EMAIL_ADDRESS).toString("base64");
const fromAddress = `=?utf-8?B?${fromBase64}?= <${SERVICE_EMAIL_ADDRESS}>`;

const sesClient = new SESv2Client({ region: "us-east-1" });

const getEmailParams = (inputs: any) => {
  const { emailAddress: replyTo, pointOfContactEmail, subject } = inputs;

  logClient(pointOfContactEmail);

  const htmlBody = getEmailTemplate(inputs);

  return {
    Destination: {
      ToAddresses: [pointOfContactEmail],
    },
    Content: {
      Simple: {
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlBody,
          },
        },
      },
    },
    ReplyToAddresses: [replyTo],
    FromEmailAddress: fromAddress,
  };
};

const sendEmail = (inputs: any) => {
  const emailParams = getEmailParams(inputs);

  return sesClient.send(new SendEmailCommand(emailParams));
};

const sendEmailWithAttachment = (inputs: any) => {
  const transporter = nodemailer.createTransport({
    SES: { sesClient, SendEmailCommand },
  });

  const { encodedFile, filename, pointOfContactEmail, subject } = inputs;

  logClient(pointOfContactEmail);

  return transporter.sendMail({
    from: fromAddress,
    to: pointOfContactEmail,
    subject,
    html: getEmailTemplate(inputs),
    attachments: [
      {
        filename,
        path: encodedFile,
      },
    ],
  });
};

export { sendEmail, sendEmailWithAttachment };
