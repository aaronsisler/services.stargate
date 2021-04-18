import { get500Response } from "../shared/response";

const handler = (_event: any, _context: any, callback: any) => {
  const response = get500Response();

  return callback(null, response);
};

export { handler };
