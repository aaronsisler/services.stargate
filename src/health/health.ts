import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { get200Response } from "../shared/response";

const healthHandler = async (
  _event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const message = `The current time is ${new Date().toTimeString()}.`;
  return get200Response(message);
};

export { healthHandler };
