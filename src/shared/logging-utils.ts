const logClient = (clientName: string, month: number) =>
  console.log(`CLIENT: ${clientName} | MONTH: ${month}`);

const logRunTime = (methodName: string, runTime: number) =>
  console.log(`METHOD: ${methodName} | RUNTIME: ${runTime}`);

export { logClient, logRunTime };
