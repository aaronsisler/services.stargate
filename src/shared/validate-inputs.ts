import { HONEYPOT_INPUT_FIELD_NAMES } from "./honeypot-input-field-names";
import { ValidateInputType } from "./validate-input-type";

const MIN_SUBMISSION_TIME_MS = 1500;

const validateInputs = (type: ValidateInputType, data: any): boolean => {
  switch (type) {
    case ValidateInputType.EMAIL:
      return validateEmailInputs(data);
    case ValidateInputType.EMAIL_ATTACHMENT:
      return validateEmailAttachmentInputs(data);
    default:
      return false;
  }
};

const isBotSubmission = (data: any): boolean => {
  if (HONEYPOT_INPUT_FIELD_NAMES.some((fieldName) => data[fieldName])) {
    return true;
  }

  if (typeof data.elapsedFormTimeMs !== "number") {
    return true;
  }

  if (data.elapsedFormTimeMs < MIN_SUBMISSION_TIME_MS) {
    return true;
  }

  return false;
};

const validateEmailAttachmentInputs = (data: any): boolean => {
  if (!validateCommonInputs(data)) {
    return false;
  }

  if (data.encodedFile === undefined || data.filename === undefined) {
    return false;
  }

  return true;
};

const validateEmailInputs = (data: any): boolean => {
  if (!validateCommonInputs(data)) {
    return false;
  }

  if (data.emailAddress === undefined) {
    return false;
  }

  if (data.phoneNumber && data.phoneNumber.length !== 10) {
    return false;
  }

  return true;
};

const validateCommonInputs = (data: any): boolean => {
  if (data.pointOfContactEmail === undefined) {
    return false;
  }

  if (data.subject === undefined) {
    return false;
  }

  return true;
};

export { validateInputs, isBotSubmission };
