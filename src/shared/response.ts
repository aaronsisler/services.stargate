const baseResponse = {
  headers: {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work.
    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS.
  },
};

const get200Response = (payload: string | object = "Success") => ({
  ...baseResponse,
  statusCode: 200,
  body: JSON.stringify(
    typeof payload === "string" ? { message: payload } : payload,
  ),
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

export { get200Response, get400Response, get403Response, get500Response };
