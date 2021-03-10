import { sendEmailWithAttachment } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get500Response,
} from "../shared/response";
import { logRunTime } from "../shared/logging-utils";
import { validateEmailAttachmentInputs } from "../shared/validate-inputs";
import { versionOneAttachmentAdapter } from "../shared/version-adapter";

const handler = async (event: any, _context: any, callback: any) => {
  const data = JSON.parse(event.body);
  const apiVersion = event.headers["api-version"];

  const inputs = !apiVersion ? versionOneAttachmentAdapter(data) : data;
  console.log(inputs);

  if (!validateEmailAttachmentInputs(inputs)) {
    return callback(null, get400Response());
  }

  try {
    const startTime = Date.now();
    await sendEmailWithAttachment(inputs);
    const totalRunTime = Date.now() - startTime;
    logRunTime("EMAIL_ATTACHMENT_HANDLER", totalRunTime);

    return callback(null, get200Response());
  } catch (error) {
    console.log(error);

    return callback(null, get500Response());
  }
};

export { handler };
