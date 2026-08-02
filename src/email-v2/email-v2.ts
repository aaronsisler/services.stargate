import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { isAuthorized } from "../shared/authorization";
import { sendEmail } from "../shared/email-service";
import {
  get200Response,
  get400Response,
  get403Response,
  get500Response,
} from "../shared/response";
import { logError, logRunTime } from "../shared/logging-utils";
import { isBotSubmission, validateInputs } from "../shared/validate-inputs";
import { ValidateInputType } from "../shared/validate-input-type";

const emailHandlerV2 = async (
  event: APIGatewayProxyEvent,
  _context: Context
) => {
  if (!isAuthorized(event)) {
    return get403Response();
  }

  if (!event.body) {
    return get400Response();
  }

  const data = JSON.parse(event.body);

  if (isBotSubmission(data)) {
    return get200Response("Bot submission received");
  }

  if (!validateInputs(ValidateInputType.EMAIL, data)) {
    return get400Response();
  }

  try {
    const startTime = Date.now();
    await sendEmail(data);
    logRunTime("EMAIL_HANDLER", startTime);

    return get200Response();
  } catch (error: any) {
    logError("EMAIL", error);

    return get500Response();
  }
};

export { emailHandlerV2 };
