import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { validateAuthorization } from "../shared/authorization-service";
import { sendEmail } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get403Response,
  get500Response,
} from "../shared/response";
import { logError, logRunTime } from "../shared/logging-utils";
import { validateEmailInputs } from "../shared/validate-inputs";
import { versionOneEmailAdapter } from "../shared/version-adapter";

const handler = async (event: APIGatewayProxyEvent, _context: Context) => {
  if (!validateAuthorization(event)) {
    return get403Response();
  }

  if (!event.body) {
    return get400Response();
  }
  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  const inputs = !apiVersion ? versionOneEmailAdapter(data) : data;

  if (!validateEmailInputs(inputs)) {
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

export { handler };
