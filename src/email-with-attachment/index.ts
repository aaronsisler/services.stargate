import { APIGatewayProxyEvent } from "aws-lambda";
import { validateAuthorization } from "../shared/authorization-service";
import { sendEmailWithAttachment } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get403Response,
  get500Response,
} from "../shared/response";
import { generateShortUuid } from "../shared/generate-uuid";
import { logError, logRunTime, logTracer } from "../shared/logging-utils";
import { validateEmailAttachmentInputs } from "../shared/validate-inputs";
import { versionOneAttachmentAdapter } from "../shared/version-adapter";

const handler = async (
  event: APIGatewayProxyEvent,
  _context: any,
  callback: any
) => {
  const traceId: string = generateShortUuid();
  logTracer(traceId, "EMAIL_ATTACHMENT__START");

  if (!validateAuthorization(event)) {
    logTracer(traceId, "EMAIL__AUTH_FAILED");
    callback(null, get403Response());
    return;
  }

  logTracer(traceId, "EMAIL__EVENT_PARSING");
  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  logTracer(traceId, "EMAIL_ATTACHMENT__INPUTS");
  const inputs = !apiVersion ? versionOneAttachmentAdapter(data) : data;

  logTracer(traceId, "EMAIL_ATTACHMENT__VALIDATE_INPUTS");
  if (!validateEmailAttachmentInputs(inputs)) {
    callback(null, get400Response());
    return;
  }

  try {
    const startTime = Date.now();
    logTracer(traceId, "EMAIL_ATTACHMENT__SEND_EMAIL");
    await sendEmailWithAttachment(inputs);
    logRunTime("EMAIL_ATTACHMENT_HANDLER", startTime);

    callback(null, get200Response());
    return;
  } catch (error) {
    logError("EMAIL_ATTACHMENT", error);

    callback(null, get500Response());
    return;
  }
};

export { handler };
