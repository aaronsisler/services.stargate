import { APIGatewayProxyEvent } from "aws-lambda";
import {
  get200Response,
  get403Response,
  getCustomResponse,
} from "../shared/response";
import { sendPayment } from "../shared/payment-utils";
import { validateAuthorization } from "../shared/authorization-service";

const paymentHandler = async (event: APIGatewayProxyEvent, _context: any) => {
  if (!validateAuthorization(event)) {
    return get403Response();
  }

  console.log("Post validateAuthorization");

  try {
    const response = await sendPayment(event);
    console.log("Post Send Payment call in handler");
    return get200Response(JSON.stringify(response));
  } catch (e) {
    return getCustomResponse(500, JSON.stringify(e));
  }
};

export { paymentHandler };
