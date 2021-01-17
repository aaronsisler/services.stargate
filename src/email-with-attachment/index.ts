import { sendEmailWithAttachment } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get500Response,
} from "../shared/response";
import { validateEmailAttachmentInputs } from "../shared/validate-inputs";

const handler = async (event: any, _context: any, callback: any) => {
  const data = JSON.parse(event.body);

  if (!validateEmailAttachmentInputs(data)) {
    return callback(null, get400Response());
  }

  try {
    await sendEmailWithAttachment(data);

    return callback(null, get200Response());
  } catch (error) {
    console.log(error);

    return callback(null, get500Response());
  }
};

export { handler };
