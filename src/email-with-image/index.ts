import { validateInputs } from "../shared/validate-inputs";
import { sendEmailWithImage } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get500Response,
} from "../shared/response";

const handler = async (event: any, _context: any, callback: any) => {
  const data = JSON.parse(event.body);
  console.log("Handler");
  console.log(data);

  if (!validateInputs({ ...data, isImage: true })) {
    return callback(null, get400Response());
  }

  try {
    await sendEmailWithImage(data);

    return callback(null, get200Response());
  } catch (error) {
    console.log(error);

    return callback(null, get500Response());
  }
};

export { handler };
