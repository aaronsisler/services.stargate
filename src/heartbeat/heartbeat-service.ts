const heartbeatService = (): string => {
  const currentTime = new Date().toTimeString();

  return `Hello, it looks like the gateway is working. The current time is ${currentTime}.`;
};

export { heartbeatService };
