import nodemailer from "nodemailer";
import { SERVICE_EMAIL_ADDRESS } from "./config";
import { getEmailTemplate } from "./email-template";
import { logClient } from "../shared/logging-utils";

const fromBase64 = Buffer.from(SERVICE_EMAIL_ADDRESS).toString("base64");

const getEmailParams = (inputs: any) => {
  const { emailAddress: replyTo, pointOfContactEmail, subject } = inputs;

  logClient(pointOfContactEmail, new Date(Date.now()).getMonth());

  const htmlBody = getEmailTemplate(inputs);

  return {
    Destination: {
      ToAddresses: [pointOfContactEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    ReplyToAddresses: [replyTo],
    Source: `=?utf-8?B?${fromBase64}?= <${SERVICE_EMAIL_ADDRESS}>`,
  };
};

const sendEmail = (inputs: any) => {
  const AWS = require("aws-sdk");
  const SES = new AWS.SES({ region: "us-east-1" });

  const emailParams = getEmailParams(inputs);

  return SES.sendEmail(emailParams).promise();
};

const sendEmailWithAttachment = (inputs: any) => {
  const AWS = require("aws-sdk");
  const SES = new AWS.SES({ region: "us-east-1" });

  // create Nodemailer SES transporter
  const transporter = nodemailer.createTransport({ SES });

  const { encodedFile, filename, pointOfContactEmail, subject } = inputs;

  logClient(pointOfContactEmail, new Date(Date.now()).getMonth());

  // send some mail
  return transporter.sendMail({
    from: `=?utf-8?B?${fromBase64}?= <${SERVICE_EMAIL_ADDRESS}>`,
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
