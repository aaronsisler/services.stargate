import { APIGatewayProxyEvent } from "aws-lambda";
import { get200Response } from "../shared/response";
import { validateAuthorization } from "../shared/authorization-service";

const handler = async (event: APIGatewayProxyEvent, _context: any) => {
  if (!validateAuthorization(event)) {
    return get200Response("You are not authorized!");
  }

  return get200Response("You are authorized!");
};

export { handler };
