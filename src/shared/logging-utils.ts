const logClient = (clientName: string) =>
  console.log(
    `CLIENT: ${clientName} | MONTH: ${new Date(Date.now()).getMonth() + 1}`
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

const logTracer = (traceId: string, pointInWorkflow: string) =>
  console.log(
    `TRACE_ID: ${traceId} | POINT_IN_WORKFLOW: ${pointInWorkflow} | TIME_STAMP: ${buildTimeStamp()}`
  );

const buildTimeStamp = () => {
  const now = new Date(Date.now());
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
};

export { logClient, logError, logInfo, logRunTime, logTracer };
