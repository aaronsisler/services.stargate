const getEmailParams = (inputs: any) => {
  const { getEmailTemplate } = require("./email-template");
  const { SERVICE_EMAIL_ADDRESS: from } = require("./config");

  const { clientName, emailAddress: replyTo, pointOfContactEmail } = inputs;
  const fromBase64 = Buffer.from(from).toString("base64");

  const htmlBody = getEmailTemplate(inputs);

  const subjectData = clientName
    ? `${clientName} Contact Request`
    : `Contact Request`;

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
        Data: subjectData
      }
    },
    ReplyToAddresses: [replyTo],
    Source: `=?utf-8?B?${fromBase64}?= <${from}>`
  };
};

const sendEmail = (inputs: any) => {
  const AWS = require("aws-sdk");
  const SES = new AWS.SES({ region: "us-east-1" });

  const emailParams = getEmailParams(inputs);

  return SES.sendEmail(emailParams).promise();
};

export { sendEmail };
