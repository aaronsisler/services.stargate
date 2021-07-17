import { sendEmailWithAttachment } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get500Response,
} from "../shared/response";
import { generateShortUuid } from "../shared/generate-uuid";
import { logRunTime, logTracer } from "../shared/logging-utils";
import { validateEmailAttachmentInputs } from "../shared/validate-inputs";
import { versionOneAttachmentAdapter } from "../shared/version-adapter";

const handler = async (event: any, _context: any, callback: any) => {
  const traceId: string = generateShortUuid();
  logTracer(traceId, "EMAIL_ATTACHMENT__START");
  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  logTracer(traceId, "EMAIL_ATTACHMENT__INPUTS");
  const inputs = !apiVersion ? versionOneAttachmentAdapter(data) : data;

  logTracer(traceId, "EMAIL_ATTACHMENT__VALIDATE_INPUTS");
  if (!validateEmailAttachmentInputs(inputs)) {
    return callback(null, get400Response());
  }

  try {
    const startTime = Date.now();
    logTracer(traceId, "EMAIL_ATTACHMENT__SEND_EMAIL");
    await sendEmailWithAttachment(inputs);
    logRunTime("EMAIL_ATTACHMENT_HANDLER", startTime);

    return callback(null, get200Response());
  } catch (error) {
    console.log(error);

    return callback(null, get500Response());
  }
};

export { handler };
