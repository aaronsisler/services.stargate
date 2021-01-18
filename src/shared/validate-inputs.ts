const validateEmailAttachmentInputs = (data: any) => {
  if (!validateCommonInputs(data)) {
    return false;
  }

  if (data.encodedFile === undefined && data.fileType === undefined) {
    return false;
  }

  return true;
};

const validateEmailInputs = (data: any) => {
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

const validateCommonInputs = (data: any) => {
  if (data.pointOfContactEmail === undefined) {
    return false;
  }

  if (data.subject === undefined) {
    return false;
  }

  return true;
};

export { validateEmailAttachmentInputs, validateEmailInputs };
