import { APIGatewayProxyEvent } from "aws-lambda";
import { Client, CreatePaymentResponse, Environment } from "square";

import { generateUuid } from "./generate-uuid";

interface PaymentEvent {
  accessTokenClient: string;
  amount: bigint;
  sourceId: string;
}

const parsePaymentEvent = (event: APIGatewayProxyEvent): PaymentEvent => {
  const { body, headers } = event;
  const { ACCESS_TOKEN_CLIENT: accessTokenClient = "" } = headers;
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
  console.log(result);

  return result;
};

export { retrieveAccessToken, sendPayment };
