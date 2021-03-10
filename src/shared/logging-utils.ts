const logClient = (clientName: string) =>
  console.log(
    `CLIENT: ${clientName} | MONTH: ${new Date(Date.now()).getMonth() + 1}`
  );

const logRunTime = (methodName: string, runTime: number) =>
  console.log(`METHOD: ${methodName} | RUNTIME: ${runTime}`);

export { logClient, logRunTime };
