const response = {
  headers: {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work.
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS.
  }
};

const get200Response = () => ({
  ...response,
  statusCode: 200,
  body: JSON.stringify({ message: "Success" })
});

const get400Response = () => ({
  ...response,
  statusCode: 400,
  body: JSON.stringify({ message: "Invalid Inputs" })
});

const get500Response = () => ({
  ...response,
  statusCode: 500,
  body: JSON.stringify({ message: "Something blew up" })
});

export { get200Response, get400Response, get500Response };
