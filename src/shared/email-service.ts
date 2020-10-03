import nodemailer from "nodemailer";
import { SERVICE_EMAIL_ADDRESS } from "./config";
import { getEmailTemplate } from "./email-template";

const fromBase64 = Buffer.from(SERVICE_EMAIL_ADDRESS).toString("base64");

const getEmailParams = (inputs: any) => {
  const { clientName, emailAddress: replyTo, pointOfContactEmail } = inputs;

  const htmlBody = getEmailTemplate(inputs);

  const subjectData = clientName
    ? `${clientName} Contact Request`
    : `Contact Request`;

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
        Data: subjectData,
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

  const { encodedFile, name, pointOfContactEmail } = inputs;

  // send some mail
  return transporter.sendMail({
    from: `=?utf-8?B?${fromBase64}?= <${SERVICE_EMAIL_ADDRESS}>`,
    to: pointOfContactEmail,
    subject: `Application Submission from ${name}`,
    html: getEmailTemplate(inputs),
    attachments: [
      {
        filename: `${name} Application.pdf`,
        path: encodedFile,
      },
    ],
  });
};

export { sendEmail, sendEmailWithAttachment };
