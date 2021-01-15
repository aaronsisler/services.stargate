import { healthService } from "./health-service";
import { get200Response } from "../shared/response";

const handler = (_event: any, _context: any, callback: any) => {
  const message = healthService();
  const response = get200Response(message);

  return callback(null, response);
};

export { handler };
