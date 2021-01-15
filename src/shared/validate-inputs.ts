const validateInputs = (data: any) => {
  if (data.pointOfContactEmail === undefined || data.name === undefined) {
    return false;
  }

  if (data.encodedFile === undefined && data.emailAddress === undefined) {
    return false;
  }

  if (data.isImage && data.fileType === undefined) {
    return false;
  }

  return true;
};

export { validateInputs };
