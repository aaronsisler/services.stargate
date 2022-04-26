import { APIGatewayProxyEvent } from "aws-lambda";
import { Client, CreatePaymentResponse, Environment } from "square";

import { generateUuid } from "./generate-uuid";

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

interface PaymentEvent {
  accessTokenClient: string;
  amount: bigint;
  sourceId: string;
}

const parsePaymentEvent = (event: APIGatewayProxyEvent): PaymentEvent => {
  const { body, headers } = event;
  const { "x-access-token-client": accessTokenClient = "" } = headers;

  const data = JSON.parse(body);
  const { amount, sourceId } = data;

  return { accessTokenClient, amount, sourceId };
};

const retrieveAccessToken = (accessTokenClient: string): string => {
  const environmentVariableName = `SQUARE_ACCESS_TOKEN_${accessTokenClient}`;

  return process.env[environmentVariableName];
};

const sendPayment = async (
  event: APIGatewayProxyEvent
): Promise<CreatePaymentResponse> => {
  const { accessTokenClient, amount, sourceId } = parsePaymentEvent(event);

  const accessToken = retrieveAccessToken(accessTokenClient);

  const { paymentsApi } = new Client({
    accessToken,
    environment: Environment.Sandbox,
  });

  const { result } = await paymentsApi.createPayment({
    idempotencyKey: generateUuid(),
    sourceId,
    amountMoney: {
      currency: "USD",
      amount,
    },
  });

  return result;
};

export { retrieveAccessToken, sendPayment };
