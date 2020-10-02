const validateInputs = (data: any) => {
  if (
    data.pointOfContactEmail === undefined ||
    data.emailAddress === undefined
  ) {
    return false;
  } else {
    return true;
  }
};

export { validateInputs };
