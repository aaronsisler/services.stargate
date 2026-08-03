const logClient = (clientName: string) =>
  console.log(
    `CLIENT: ${clientName} | MONTH: ${new Date(Date.now()).getMonth() + 1}`,
  );

const logError = (caller: string, errorMessage: string): void => {
  console.warn(`ERROR: ${caller}`);
  console.warn(errorMessage);
};

const logInfo = (caller: string, message: string): void => {
  console.info(`INFO: ${caller}`);
  console.info(message);
};

const logRunTime = (methodName: string, startTime: number) => {
  const totalRunTime = Date.now() - startTime;
  console.log(`METHOD: ${methodName} | RUN_TIME: ${totalRunTime}`);
};

export { logClient, logError, logInfo, logRunTime };
