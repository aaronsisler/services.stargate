import { APIGatewayProxyEvent } from "aws-lambda";
import {
  get200Response,
  get403Response,
  getCustomResponse,
} from "../shared/response";
import { logError, logInfo } from "../shared/logging-utils";
import { sendPayment } from "../shared/payment-utils";
import { validateAuthorization } from "../shared/authorization-service";

const paymentHandler = async (event: APIGatewayProxyEvent, _context: any) => {
  if (!validateAuthorization(event)) {
    logError("paymentHandler", JSON.stringify(event));
    return get403Response();
  }
  logInfo("paymentHandler", "Post Authorization");

  try {
    const response = await sendPayment(event);
    return get200Response(JSON.stringify(response));
  } catch (e) {
    logError("paymentHandler", e);
    return getCustomResponse(500, JSON.stringify(e));
  }
};

export { paymentHandler };
