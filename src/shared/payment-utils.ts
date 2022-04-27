import { APIGatewayProxyEvent } from "aws-lambda";
import { Address, Client, CreatePaymentResponse, Environment } from "square";

import { generateUuid } from "./generate-uuid";

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

interface PaymentEvent {
  accessTokenClient: string;
  amount: bigint;
  billingAddress: Address;
  customerInfo: any;
  note: string;
  sourceId: string;
}

const parsePaymentEvent = (event: APIGatewayProxyEvent): PaymentEvent => {
  const { body, headers } = event;
  const { "x-access-token-client": accessTokenClient = "" } = headers;

  const data = JSON.parse(body);
  const { amount, billingAddress, customerInfo, note, sourceId } = data;

  return {
    accessTokenClient,
    amount,
    billingAddress,
    customerInfo,
    note,
    sourceId,
  };
};

const retrieveAccessToken = (accessTokenClient: string): string => {
  const environmentVariableName = `SQUARE_ACCESS_TOKEN_${accessTokenClient}`;

  return process.env[environmentVariableName];
};

const sendPayment = async (
  event: APIGatewayProxyEvent
): Promise<CreatePaymentResponse> => {
  const {
    accessTokenClient,
    amount,
    billingAddress,
    customerInfo,
    note,
    sourceId,
  } = parsePaymentEvent(event);

  const accessToken = retrieveAccessToken(accessTokenClient);

  const { customersApi, paymentsApi } = new Client({
    accessToken,
    environment: Environment.Sandbox,
  });

  const { result: customerResult } = await customersApi.createCustomer({
    idempotencyKey: generateUuid(),
    ...customerInfo,
    address: billingAddress,
  });

  const { result } = await paymentsApi.createPayment({
    idempotencyKey: generateUuid(),
    sourceId,
    amountMoney: {
      currency: "USD",
      amount,
    },
    customerId: customerResult.customer.id,
    note,
  });

  return result;
};

export { retrieveAccessToken, sendPayment };
