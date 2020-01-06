exports.validateInputs = data => {
  if (data.pointOfContactEmail === undefined || data.name === undefined) {
    return false;
  } else {
    return true;
  }
};
