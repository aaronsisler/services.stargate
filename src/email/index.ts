import { APIGatewayProxyEvent } from "aws-lambda";
import { validateAuthorization } from "../shared/authorization-service";
import { sendEmail } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get403Response,
  get500Response,
} from "../shared/response";
import { generateShortUuid } from "../shared/generate-uuid";
import { logError, logRunTime, logTracer } from "../shared/logging-utils";
import { validateEmailInputs } from "../shared/validate-inputs";
import { versionOneEmailAdapter } from "../shared/version-adapter";

const handler = async (
  event: APIGatewayProxyEvent,
  _context: any,
  callback: any
) => {
  const traceId: string = generateShortUuid();
  logTracer(traceId, "EMAIL__START");

  if (!validateAuthorization(event)) {
    logTracer(traceId, "EMAIL__AUTH_FAILED");
    callback(null, get403Response());
    return;
  }

  logTracer(traceId, "EMAIL__EVENT_PARSING");
  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  logTracer(traceId, "EMAIL__INPUTS");
  const inputs = !apiVersion ? versionOneEmailAdapter(data) : data;

  logTracer(traceId, "EMAIL__VALIDATE_INPUTS");
  if (!validateEmailInputs(inputs)) {
    return callback(null, get400Response());
  }

  try {
    const startTime = Date.now();
    logTracer(traceId, "EMAIL__SEND_EMAIL");
    await sendEmail(inputs);
    logRunTime("EMAIL_HANDLER", startTime);

    return callback(null, get200Response());
  } catch (error) {
    logError("EMAIL", error);

    return callback(null, get500Response());
  }
};

export { handler };
