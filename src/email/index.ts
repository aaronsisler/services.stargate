import { sendEmail } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get500Response,
} from "../shared/response";
import { logRunTime } from "../shared/logging-utils";
import { validateEmailInputs } from "../shared/validate-inputs";
import { versionOneEmailAdapter } from "../shared/version-adapter";

const handler = async (event: any, _context: any, callback: any) => {
  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  const inputs = !apiVersion ? versionOneEmailAdapter(data) : data;

  if (!validateEmailInputs(inputs)) {
    return callback(null, get400Response());
  }

  try {
    const startTime = Date.now();
    await sendEmail(inputs);
    const totalRunTime = Date.now() - startTime;
    logRunTime("EMAIL_HANDLER", totalRunTime);

    return callback(null, get200Response());
  } catch (error) {
    console.log(error);

    return callback(null, get500Response());
  }
};

export { handler };
