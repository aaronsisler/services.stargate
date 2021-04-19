import { get400Response } from "../shared/response";

const handler = (_event: any, _context: any, callback: any) => {
  const response = get400Response();

  return callback(null, response);
};

export { handler };
