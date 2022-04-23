import { APIGatewayProxyEvent } from "aws-lambda";
import { VALID_IP_ADDRESSES, VALID_REFERERS } from "./config";

const validateAuthorization = (event: APIGatewayProxyEvent): boolean => {
  const { headers } = event;
  const { Referer: referer = "" } = headers;
  const trimmedReferer = referer.trim().replace(/\/$/, "");

  let isRefererAuthorized: boolean = false;
  console.log("Referer");
  console.log(referer);

  if (referer) {
    isRefererAuthorized = VALID_REFERERS.some(
      (allowedReferer: string) => allowedReferer == trimmedReferer
    );
  }
  console.log("isRefererAuthorized");
  console.log(isRefererAuthorized);

  if (isRefererAuthorized) {
    return true;
  }

  const ipRange: string = headers["X-Forwarded-For"] || "";
  const isIpAuthorized: boolean = ipRange
    .split(",")
    .some((ipAddress: string) => VALID_IP_ADDRESSES.includes(ipAddress.trim()));

  return isIpAuthorized || false;
};

export { validateAuthorization };
