exports.sendEmailWithAttachment = inputs => {
  const nodemailer = require("nodemailer");
  const aws = require("aws-sdk");
  const ses = new aws.SES({ apiVersion: "2010-12-01" });
  const { SERVICE_EMAIL_ADDRESS: from } = require("./config");
  const { getEmailTemplate } = require("./email-with-attachment-template");
  const {
    emailAddress: replyTo,
    encodedFile,
    name,
    pointOfContactEmail
  } = inputs;
  const fromBase64 = Buffer.from(from).toString("base64");

  // create Nodemailer SES transporter
  const transporter = nodemailer.createTransport({ SES: ses });

  // send some mail
  return transporter.sendMail({
    from: `=?utf-8?B?${fromBase64}?= <${from}>`,
    to: pointOfContactEmail,
    replyTo,
    subject: `Application Submission from ${name}`,
    html: getEmailTemplate(inputs),
    attachments: [
      {
        filename: `${name} Application.pdf`,
        path: encodedFile
      }
    ]
  });
};
