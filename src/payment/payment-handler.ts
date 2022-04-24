import { APIGatewayProxyEvent } from "aws-lambda";
import { get200Response, get403Response } from "../shared/response";
import { retrieveAccessToken } from "../shared/payment-utils";
import { validateAuthorization } from "../shared/authorization-service";

const paymentHandler = async (event: APIGatewayProxyEvent, _context: any) => {
  if (!validateAuthorization(event)) {
    return get403Response();
  }
  const { headers } = event;
  const { ACCESS_TOKEN_CLIENT = "" } = headers;
  const tokenValue = retrieveAccessToken(ACCESS_TOKEN_CLIENT);
  return get200Response(tokenValue);
};

export { paymentHandler };
