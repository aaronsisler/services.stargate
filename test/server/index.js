const PORT_NUMBER = 9001;
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  const { healthService } = require("../../src/health/health-service");
  const { body, statusCode } = healthService();

  res.status(statusCode).send(body);
});

app.listen(PORT_NUMBER);

console.log(`Listening on PORT: ${PORT_NUMBER}`);
