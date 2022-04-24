import { APIGatewayProxyEvent } from "aws-lambda";
import { get200Response, get403Response } from "../shared/response";
import { sendPayment } from "../shared/payment-utils";
import { validateAuthorization } from "../shared/authorization-service";

const paymentHandler = async (event: APIGatewayProxyEvent, _context: any) => {
  if (!validateAuthorization(event)) {
    return get403Response();
  }

  const response = await sendPayment(event);

  return get200Response(JSON.stringify(response));
};

export { paymentHandler };
