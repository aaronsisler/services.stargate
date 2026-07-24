import { APIGatewayProxyEvent, Context } from "aws-lambda";
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

const handler = async (event: APIGatewayProxyEvent, _context: Context) => {
  const traceId: string = generateShortUuid();
  logTracer(traceId, "EMAIL__START");

  if (!validateAuthorization(event)) {
    logTracer(traceId, "EMAIL__AUTH_FAILED");
    return get403Response();
  }

  logTracer(traceId, "EMAIL__EVENT_PARSING");
  if (!event.body) {
    return get400Response();
  }
  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  logTracer(traceId, "EMAIL__INPUTS");
  const inputs = !apiVersion ? versionOneEmailAdapter(data) : data;

  logTracer(traceId, "EMAIL__VALIDATE_INPUTS");
  if (!validateEmailInputs(inputs)) {
    return get400Response();
  }

  try {
    const startTime = Date.now();
    logTracer(traceId, "EMAIL__SEND_EMAIL");
    await sendEmail(inputs);
    logRunTime("EMAIL_HANDLER", startTime);

    return get200Response();
  } catch (error: any) {
    logError("EMAIL", error);

    return get500Response();
  }
};

export { handler };
