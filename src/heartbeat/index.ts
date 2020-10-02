// exports.handler = (event, context, callback) => {
//   const { healthService } = require("./health-service");
//   const response = healthService();

//   callback(null, response);
// };

import { heartbeatService } from "./heartbeat-service";

const handler = (event, context, callback) => {
  const response = heartbeatService();

  callback(null, response);
};

export { handler };
