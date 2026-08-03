import { APIGatewayProxyEvent } from "aws-lambda";
import { VALID_IP_ADDRESSES, VALID_REFERERS } from "./config";

const isAuthorized = (event: APIGatewayProxyEvent): boolean => {
  const { headers } = event;

  const referer = (headers.Referer || "").trim().replace(/\/$/, "");

  if (VALID_REFERERS.includes(referer)) {
    return true;
  }

  const forwardedFor = headers["X-Forwarded-For"] || "";

  return forwardedFor
    .split(",")
    .some((ip) => VALID_IP_ADDRESSES.includes(ip.trim()));
};

export { isAuthorized };
