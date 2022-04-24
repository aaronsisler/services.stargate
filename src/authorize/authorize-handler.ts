import { APIGatewayProxyEvent } from "aws-lambda";
import { get200Response, get403Response } from "../shared/response";
import { validateAuthorization } from "../shared/authorization-service";

const authorizerHandler = async (
  event: APIGatewayProxyEvent,
  _context: any
) => {
  if (!validateAuthorization(event)) {
    return get403Response();
  }

  return get200Response("You are authorized!");
};

export { authorizerHandler };
