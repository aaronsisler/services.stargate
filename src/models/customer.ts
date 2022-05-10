import { Address } from "square";

export interface CustomerAddressDto {
  addressLine1: string;
  addressLine2: string;
  city: string; // locality
  state: string; // administrativeDistrictLevel1
  postalCode: string;
}

export interface CustomerInfoDto {
  firstName: string;
  lastName: string;
  companyName: string;
  emailAddress: string;
  phoneNumber: string;
  address: CustomerAddressDto;
}

export interface CustomerInfo {
  givenName: string;
  familyName: string;
  companyName: string;
  emailAddress: string;
  phoneNumber: string;
  address: Address;
}
