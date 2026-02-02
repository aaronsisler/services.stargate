import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { healthService } from "./health-service";
import { get200Response } from "../shared/response";

const handler = async (
  _event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const message = healthService();
  return get200Response(message);
};

export { handler };
