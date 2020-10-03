import { validateInputs } from "../shared/validate-inputs";
import { sendEmail } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get500Response,
} from "../shared/response";

const handler = async (event: any, _context: any, callback: any) => {
  const data = JSON.parse(event.body);

  if (!validateInputs(data)) {
    return callback(null, get400Response());
  }

  try {
    await sendEmail(data);

    return callback(null, get200Response());
  } catch (error) {
    console.log(error);

    return callback(null, get500Response());
  }
};

export { handler };
