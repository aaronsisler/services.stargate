const baseResponse = {
  headers: {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work.
    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS.
  },
};

const get200Response = (message: string = "Success") => ({
  ...baseResponse,
  statusCode: 200,
  body: message,
});

const get400Response = () => ({
  ...baseResponse,
  statusCode: 400,
  body: "Invalid Inputs",
});

const get403Response = () => ({
  ...baseResponse,
  statusCode: 403,
  body: "Unauthorized",
});

const get500Response = () => ({
  ...baseResponse,
  statusCode: 500,
  body: "Something blew up",
});

const getCustomResponse = (
  statusCode: number = 200,
  message: string = "Success"
) => ({
  ...baseResponse,
  statusCode: statusCode,
  body: message,
});

export {
  get200Response,
  get400Response,
  get403Response,
  get500Response,
  getCustomResponse,
};
