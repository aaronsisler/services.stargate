import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { validateAuthorization } from "../shared/authorization-service";
import { sendEmailWithAttachment } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get403Response,
  get500Response,
} from "../shared/response";
import { logError, logRunTime } from "../shared/logging-utils";
import { validateEmailAttachmentInputs } from "../shared/validate-inputs";
import { versionOneAttachmentAdapter } from "../shared/version-adapter";

const handler = async (event: APIGatewayProxyEvent, _context: Context) => {
  if (!validateAuthorization(event)) {
    return get403Response();
  }

  if (!event.body) {
    return get400Response();
  }

  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  const inputs = !apiVersion ? versionOneAttachmentAdapter(data) : data;

  if (!validateEmailAttachmentInputs(inputs)) {
    return get400Response();
  }

  try {
    const startTime = Date.now();
    await sendEmailWithAttachment(inputs);
    logRunTime("EMAIL_ATTACHMENT_HANDLER", startTime);

    return get200Response();
  } catch (error: any) {
    logError("EMAIL_ATTACHMENT", error);

    return get500Response();
  }
};

export { handler };
