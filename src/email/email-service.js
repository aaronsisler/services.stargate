const getEmailParams = inputs => {
  const { getEmailTemplate } = require("./email-template");
  const { SERVICE_EMAIL_ADDRESS: from } = require("./config");

  const { emailAddress: replyTo, pointOfContactEmail } = inputs;
  const fromBase64 = Buffer.from(from).toString("base64");

  const htmlBody = getEmailTemplate(inputs);

  return {
    Destination: {
      ToAddresses: [pointOfContactEmail]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Contact Form Submission"
      }
    },
    ReplyToAddresses: [replyTo],
    Source: `=?utf-8?B?${fromBase64}?= <${from}>`
  };
};

exports.sendEmail = inputs => {
  const AWS = require("aws-sdk");
  const SES = new AWS.SES({ region: "us-east-1" });

  const emailParams = getEmailParams(inputs);

  return SES.sendEmail(emailParams).promise();
};
