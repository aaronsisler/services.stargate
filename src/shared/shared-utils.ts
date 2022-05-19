const retrieveEnvironmentVariable = (environmentVariableName: string): string =>
  process.env[environmentVariableName];

export { retrieveEnvironmentVariable };
