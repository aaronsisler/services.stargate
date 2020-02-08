exports.handler = async ({ body: rawData }, context, callback) => {
  const { validateInputs } = require("./validate-inputs");
  const {
    sendEmailWithAttachment
  } = require("./email-with-attachment-service");
  const {
    get200Response,
    get400Response,
    get500Response
  } = require("./response");

  const data = JSON.parse(rawData);

  if (!validateInputs(data)) {
    return callback(null, get400Response());
  }

  try {
    await sendEmailWithAttachment(data);

    return callback(null, get200Response());
  } catch (error) {
    console.log(error);

    return callback(null, get500Response());
  }
};
