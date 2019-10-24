const response = {
  headers: {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work.
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS.
  }
};

exports.get200Response = () => ({
  ...response,
  statusCode: 200,
  body: JSON.stringify({ message: "Success" })
});

exports.get400Response = () => ({
  ...response,
  statusCode: 400,
  body: JSON.stringify({ message: "Invalid Inputs" })
});

exports.get500Response = () => ({
  ...response,
  statusCode: 500,
  body: JSON.stringify({ message: "Something blew up" })
});
