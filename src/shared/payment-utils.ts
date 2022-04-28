import { APIGatewayProxyEvent } from "aws-lambda";
import { Address, Client, CreatePaymentResponse, Environment } from "square";

import { generateUuid } from "./generate-uuid";

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

interface CustomerInfo {
  givenName: string;
  familyName: string;
  companyName: string;
  emailAddress: string;
  phoneNumber: string;
  address: Address;
}

interface PaymentEvent {
  accessTokenClient: string;
  amount: bigint;
  customerInfo: CustomerInfo;
  note: string;
  sourceId: string;
}

const parsePaymentEvent = (event: APIGatewayProxyEvent): PaymentEvent => {
  const { body, headers } = event;
  const { "x-access-token-client": accessTokenClient = "" } = headers;

  const data = JSON.parse(body);
  const { amount, customerInfo, note, sourceId } = data;

  return {
    accessTokenClient,
    amount,
    customerInfo,
    note,
    sourceId,
  };
};

const retrieveAccessToken = (accessTokenClient: string): string => {
  const environmentVariableName = `PAYMENT_ACCESS_TOKEN_${accessTokenClient}`;

  return process.env[environmentVariableName];
};

const sendPayment = async (
  event: APIGatewayProxyEvent
): Promise<CreatePaymentResponse> => {
  const {
    accessTokenClient,
    amount,
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
