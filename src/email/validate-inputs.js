exports.validateInputs = data => {
  if (
    data.pointOfContactEmail === undefined ||
    data.emailAddress === undefined ||
    (data.name === undefined && data.website === undefined)
  ) {
    return false;
  } else {
    return true;
  }
};
