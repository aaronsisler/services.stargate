exports.handler = (event, context, callback) => {
  const { healthService } = require("./health-service");
  const response = healthService();

  callback(null, response);
};
