import { APIGatewayProxyEvent } from "aws-lambda";
import { get200Response, get403Response } from "../shared/response";
import { validateAuthorization } from "../shared/authorization-service";

const handler = (event: APIGatewayProxyEvent, _context: any, callback: any) => {
  if (!validateAuthorization(event)) {
    // callback(null, get403Response());
    callback(null, get200Response("You are not authorized!"));
    return;
  }

  const response = get200Response("You are authorized!");

  return callback(null, response);
};

export { handler };
