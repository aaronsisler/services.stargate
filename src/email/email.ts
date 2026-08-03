import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { isAuthorized } from "../shared/authorization";
import { sendEmail } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get403Response,
  get500Response,
} from "../shared/response";
import { logError, logRunTime } from "../shared/logging-utils";
import { isBotSubmission, validateInputs } from "../shared/validate-inputs";
import { versionOneEmailAdapter } from "../shared/version-adapter";
import { ValidateInputType } from "../shared/validate-input-type";

const emailHandler = async (event: APIGatewayProxyEvent, _context: Context) => {
  if (!isAuthorized(event)) {
    return get403Response();
  }

  if (!event.body) {
    return get400Response();
  }

  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  const inputs = !apiVersion ? versionOneEmailAdapter(data) : data;

  if (isBotSubmission(inputs)) {
    return get200Response();
  }

  if (!validateInputs(ValidateInputType.EMAIL, inputs)) {
    return get400Response();
  }

  try {
    const startTime = Date.now();
    await sendEmail(inputs);
    logRunTime("EMAIL_HANDLER", startTime);

    return get200Response();
  } catch (error: any) {
    logError("EMAIL", error);

    return get500Response();
  }
};

export { emailHandler };
