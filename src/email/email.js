exports.handler = async ({ body: rawData }, context, callback) => {
  const { validateInputs } = require("./validate-inputs");
  const { sendEmail } = require("./email-service");
  const {
    get200Response,
    get400Response,
    get500Response
  } = require("./response");

  const data = JSON.parse(rawData);

  if (!validateInputs(data)) {
    callback(null, get400Response());
  }

  try {
    await sendEmail(data);
    callback(null, get200Response());
  } catch (error) {
    console.log(error);
    callback(null, get500Response());
  }
};
