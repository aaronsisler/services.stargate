// SQUARE_ACCESS_TOKEN_DRCG_PROPERTIES
const retrieveAccessToken = (accessTokenClient: string): string => {
  const environmentVariableName = `SQUARE_ACCESS_TOKEN_${accessTokenClient}`;
  console.log("environmentVariableName");
  console.log(environmentVariableName);
  console.log("process");
  console.log(process.env[environmentVariableName]);

  return process.env[environmentVariableName];
};

export { retrieveAccessToken };
