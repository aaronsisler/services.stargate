import { APIGatewayProxyEvent } from "aws-lambda";
import { Address, Client, CreatePaymentResponse, Environment } from "square";

import { generateUuid } from "./generate-uuid";
import { retrieveEnvironmentVariable } from "../shared/shared-utils";
import { CustomerInfo, CustomerInfoDto } from "../models/customer";

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

interface PaymentRequest {
  accessTokenClient: string;
  amount: bigint;
  customerInfo: CustomerInfo;
  note: string;
  sourceId: string;
}

const mapCustomerInfo = (customerInfoDto: CustomerInfoDto): CustomerInfo => {
  const address: Address = Object.assign(
    {},
    {
      addressLine1: customerInfoDto.address.addressLine1,
      addressLine2: customerInfoDto.address.addressLine2,
      locality: customerInfoDto.address.city,
      administrativeDistrictLevel1: customerInfoDto.address.state,
      postalCode: customerInfoDto.address.postalCode,
    }
  );

  const customerInfo: CustomerInfo = Object.assign(
    {},
    {
      givenName: customerInfoDto.firstName,
      familyName: customerInfoDto.lastName,
      companyName: customerInfoDto.companyName,
      emailAddress: customerInfoDto.emailAddress,
      phoneNumber: customerInfoDto.phoneNumber,
      address,
    }
  );

  return customerInfo;
};

const parsePaymentRequest = (event: APIGatewayProxyEvent): PaymentRequest => {
  const { body, headers } = event;
  const { "x-access-token-client": accessTokenClient = "" } = headers;

  const data = JSON.parse(body);
  const { amount, customerInfo: rawCustomerInfo, note, sourceId } = data;

  return {
    accessTokenClient,
    amount,
    customerInfo: mapCustomerInfo(rawCustomerInfo),
    note,
    sourceId,
  };
};

const retrieveAccessToken = (accessTokenClient: string): string => {
  const environmentVariableName = `PAYMENT_ACCESS_TOKEN_${accessTokenClient}`;
  console.log("environmentVariableName");
  console.log(environmentVariableName);

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
  } = parsePaymentRequest(event);

  const accessToken = retrieveAccessToken(accessTokenClient);
  console.log("accessToken");
  console.log(accessToken);

  const isProd: boolean = retrieveEnvironmentVariable("NODE_ENV") === "prod";

  const { customersApi, paymentsApi } = new Client({
    accessToken,
    environment: isProd ? Environment.Production : Environment.Sandbox,
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

export { sendPayment };
