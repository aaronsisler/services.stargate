import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { get200Response } from "../shared/response";

const infoHandler = async (
  _event: APIGatewayProxyEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
  return get200Response({
    currentTime: new Date().toTimeString(),
    version: process.env.APP_VERSION,
  });
};

export { infoHandler };
