import { heartbeatService } from "./heartbeat-service";

const handler = (_event: any, _context: any, callback: any) => {
  const response = heartbeatService();

  callback(null, response);
};

export { handler };
